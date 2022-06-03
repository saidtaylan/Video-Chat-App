<template>
  <div ref="videoContainer"
       class="container mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 pt-6 gap-8"
  >
    <div class="rounded border-gray-300 dark:border-gray-700"
         v-for="attendee in components">
      <component :is="attendee" v-bind="videoProps"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onBeforeRouteLeave, useRoute, useRouter} from "vue-router"
import {LocalStream, Client} from "ion-sdk-js";
import {IonSFUJSONRPCSignal} from "ion-sdk-js/lib/signal/json-rpc-impl";
import {useUserStore} from "@/stores/user.store";
import {defineAsyncComponent, markRaw, reactive, ref, shallowRef} from "vue"
import type {RemoteStream} from "ion-sdk-js/lib/ion";
import {useCommonStore} from "@/stores/common.store";
import {useRoomStore} from "@/stores/room.store";

const commonStore = useCommonStore()
const roomStore = useRoomStore()

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const videoContainer = ref(null)
const components = ref(<any>[])

const link = route.params.link as string


let localStream: LocalStream | null;

let client: Client
const webrtcConfig = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

const videoProps = reactive(<{ autoplay: boolean, controls: boolean, muted: boolean, srcObject: null | {}, speaker: boolean }>{
  autoplay: true,
  controls: false,
  muted: false,
  srcObject: null,
})

const signal = new IonSFUJSONRPCSignal("ws://localhost:7000/ws");
client = new Client(signal, webrtcConfig as any);
signal.onopen = () => client.join(link, userStore.getUser.onlineId);
client.ontrack = (track, stream) => {
  videoProps["speaker"] = false
  if (track.kind === 'video') {
    const comp = defineAsyncComponent(() => import('@/components/Attendee.vue'))
    components.value.push(markRaw(comp))
    track.onunmute = () => {
      videoProps["muted"] = false
      videoProps["srcObject"] = stream
      stream.onremovetrack = () => {
        videoProps["muted"] = false
        localStream = null
        videoProps["srcObject"] = null
      }
    }
  }
}

console.log(client)

client.onspeaker = () => {
  console.log("konuşuyom")
  roomStore.setIsSpeakingStatus(true)
}

const startPublish = () => {
  LocalStream.getUserMedia({
    resolution: "vga",
    audio: true,
    codec: "vp8"
  }).then((stream) => {
    localStream = stream
    const comp = defineAsyncComponent(() => import('@/components/Attendee.vue'))
    components.value.push(markRaw(comp))
    videoProps["muted"] = false
    videoProps["srcObject"] = localStream
    client.publish(stream);
  }).catch(console.error);
}

startPublish()

const changeMicState = (on: boolean) => {
  if (localStream) {
    localStream.getAudioTracks()[0].enabled = on;
  }
}

const changeCameraState = (on: boolean) => {
  if (localStream) {
    localStream.getVideoTracks()[0].enabled = on;
  }
}

const leave = async (next?: Function) => {
  if (window.confirm("Görüşmeden ayrılmak istediğinize emin misiniz?")) {
    userStore.removeDisplayName()
    localStream!.getTracks().forEach((track) => {
      track.stop();
    });
    client.leave()
    signal.close()
    await roomStore.leaveRoom()
    if (roomStore.getActiveRoom.owner === userStore.getUser.onlineId) {
      roomStore.changeOwner(link, roomStore.getActiveRoom.participants[Math.floor(Math.random() * (roomStore.getActiveRoom.participants.length - 1))].onlineId)
    }
    if (next) {
      next()
    }
    router.go(-1)
  }
}

onBeforeRouteLeave(async (to, from, next) => {
  await leave(next)
})

commonStore.setCameraStateFunc(changeCameraState)
commonStore.setMicStateFunc(changeMicState)
commonStore.setLeaveFunc(leave)
</script>
