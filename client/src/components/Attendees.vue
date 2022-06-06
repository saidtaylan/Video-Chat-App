<template>
  <div ref="videoContainer"
       class="container mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 pt-6 gap-8"
  >
    <div v-for="videoProp in videoProps" class="rounded border-gray-300 dark:border-gray-700">
      <attendee v-bind="videoProp"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onBeforeRouteLeave, useRoute, useRouter} from "vue-router"
import {LocalStream, Client} from "ion-sdk-js";
import {IonSFUJSONRPCSignal} from "ion-sdk-js/lib/signal/json-rpc-impl";
import {useUserStore} from "@/stores/user.store";
import {ref} from "vue"
import {useCommonStore} from "@/stores/common.store";
import {useRoomStore} from "@/stores/room.store";
import Attendee from "@/components/Attendee.vue"

const commonStore = useCommonStore()
const roomStore = useRoomStore()

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const videoContainer = ref(null)
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

const videoProps = ref(<{ videoAttr: { autoplay: boolean, controls: boolean, muted: boolean, srcObject: null | {} }, extra: { own: boolean, streamId: string } }[]>[])

const signal = new IonSFUJSONRPCSignal("ws://localhost:7000/ws");
client = new Client(signal, webrtcConfig as any);
signal.onopen = () => client.join(link, userStore.getUser.onlineId);
client.ontrack = (track, stream) => {
  if (track.kind === 'video') {
    videoProps.value.push({
      videoAttr: {muted: false, autoplay: true, srcObject: stream, controls: false},
      extra: {own: false, streamId: stream.id}
    })
  }
  stream.onremovetrack = () => {
    videoProps.value = videoProps.value.filter((v, idx) => v.extra.streamId !== stream.id)
  }
}

const startPublish = () => {
  LocalStream.getUserMedia({
    resolution: "vga",
    audio: true,
    codec: "vp8"
  }).then((stream) => {
    localStream = stream
    //const comp = defineComponent(() => import('@/components/Attendee.vue'))
    videoProps.value.push({
      videoAttr: {muted: true, autoplay: true, srcObject: stream, controls: false},
      extra: {own: true, streamId: stream.id}
    })
    roomStore.addStreamId(stream.id)
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

const leave = async () => {
  await router.replace({name: 'home'})
}

const leaveProcess = async () => {
  userStore.removeDisplayName()
  localStream!.getTracks().forEach((track) => {
    track.stop();
  });
  client.leave()
  signal.close()
  await roomStore.leaveRoom()
}

onBeforeRouteLeave(async (to, from, next) => {
  if (window.confirm("Görüşmeden ayrılmak istediğinize emin misiniz?")) {
    await leaveProcess()
    if (roomStore.getActiveRoom.owner === userStore.getUser.onlineId) {
      roomStore.changeOwner(link, roomStore.getActiveRoom.participants[Math.floor(Math.random() * (roomStore.getActiveRoom.participants.length - 1))].onlineId)
    }
    next(true)
  } else next(false)
})

commonStore.setCameraStateFunc(changeCameraState)
commonStore.setMicStateFunc(changeMicState)
commonStore.setLeaveFunc(leave)
</script>
