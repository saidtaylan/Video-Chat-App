<template>
  <div ref="videoContainer"
       class="container mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 pt-6 gap-8"
  >
    <div class="rounded border-gray-300 dark:border-gray-700 border-dashed border-2 h-24"
         v-for="(attendee, idx) in components">
      <keep-alive>
        <component :is="attendee" :attendeeVideo.sync="attendee" :ref="'attendeeVideo-'+idx"/>
      </keep-alive>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router"
import {LocalStream, Client} from "ion-sdk-js";
import {IonSFUJSONRPCSignal} from "ion-sdk-js/lib/signal/json-rpc-impl";
import {useUserStore} from "@/stores/user.store";
import {defineAsyncComponent, onMounted, onUpdated, ref, shallowRef} from "vue"

const route = useRoute()
const user = useUserStore()

const videoContainer = ref(null)
const components = shallowRef(<any>[])
const attendeeRefList = ref([])

let client: Client
const webrtcConfig = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

// video ref problem
onMounted(() => {
  const signal: IonSFUJSONRPCSignal = new IonSFUJSONRPCSignal("ws://localhost:7000/ws");
  client = new Client(signal, webrtcConfig as any);

  signal.onopen = () => client.join(route.params.link as string, user.getUser.onlineId);
  client.ontrack = (track, stream) => {
    const comp = defineAsyncComponent(() => import("@/components/Attendee.vue"))
    components.value.push(comp)
    if (track.kind === 'video') {
      track.onunmute = () => {
        // videoEl.autoplay = true;
        // videoEl.controls = true;
        // videoEl.muted = false;
        // when the publisher leave
        stream.onremovetrack = () => {
          // videoEl.srcObject = null;
        }
      }
    }
  }

  const startPublish = () => {
    LocalStream.getUserMedia({
      resolution: "vga",
      audio: true,
      codec: "vp8"
    }).then((stream) => {
      console.log(attendeeRefList.value)
      // videoEl.autoplay = true;
      // videoEl.controls = true;
      // videoEl.muted = true;
      // videoEl.srcObject = stream;
      // videoContainer.appendChild(videoEl);
      client.publish(stream);
    }).catch(console.error);
  }
  startPublish()
})
</script>
