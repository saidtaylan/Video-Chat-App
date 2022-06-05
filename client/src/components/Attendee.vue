<template>
  <div class="flex items-center justify-between w-full" @contextmenu.prevent="openContextMenu">
    <div
        class="flex flex-col lg:flex-row w-full items-start lg:items-center rounded"
    >
      <video class="rounded" ref="Video" v-bind="props.videoAttr"></video>
    </div>
  </div>
  <dropdown :menuAxisX="contextMenuAxisX" :menuAxisY="contextMenuAxisY" v-if="isOpenContextMenu"
            v-click-away="closeContextMenu">
    <div
        class="flex items-center justify-between rounded text-gray-600 hover:text-gray-800 p-3"
    >
      <button @click="switchUserMic" v-click-away="closeContextMenu" v-if="isOwner && extra.own === false">
        {{ userMicStatus ? 'Sessize al' : 'Sesini aç' }}
        <mute-icon></mute-icon>
      </button>
    </div>
    <div
        class="flex items-center justify-between rounded text-gray-600 hover:text-gray-800 p-3"
    >
      <button @click="switchUserCam" v-click-away="closeContextMenu" v-if="isOwner && extra.own === false">
        {{ userCamStatus ? 'Kamera kapat' : 'Kamera aç' }}
        <video-camera-off></video-camera-off>
      </button>
    </div>
  </dropdown>
</template>

<script setup lang="ts">

import {computed, ref} from "vue";
import Dropdown from "@/components/dropdown.vue";
import MuteIcon from "@/icons/muted.vue"
import {useRoomStore} from "@/stores/room.store";

import {isOwner} from "@/helpers/isOwner";
import VideoCameraOff from "@/icons/videoCameraOff.vue";
import type {LocalStream} from "ion-sdk-js";
import type {RemoteStream} from "ion-sdk-js/lib/ion";
import {useCommonStore} from "@/stores/common.store";

const commonStore = useCommonStore()
const roomStore = useRoomStore()

const props = defineProps<{
  videoAttr: {
    autoplay: boolean, muted: boolean, controls: boolean,
    srcObject: LocalStream | RemoteStream | null
  },
  extra: { own: boolean }
}>()

const isOpenContextMenu = ref(false)
const contextMenuAxisX = ref(0)
const contextMenuAxisY = ref(0)

const openContextMenu = (event: any) => {
  contextMenuAxisX.value = event.clientX
  contextMenuAxisY.value = event.clientY
  isOpenContextMenu.value = true
}

const closeContextMenu = () => {
  isOpenContextMenu.value = false
}

const userMicStatus = ref(true)
const userCamStatus = ref(true)

const participantInfo = computed(() => {
  return roomStore.getParticipantByStreamId(props.videoAttr.srcObject!.id)
})

const switchUserMic = () => {
  userMicStatus.value = !userMicStatus.value
  roomStore.switchUserMic(participantInfo.value!.socketId, userMicStatus.value)
  closeContextMenu()
}

const switchUserCam = () => {
  userCamStatus.value = !userCamStatus.value
  roomStore.switchUserCam(participantInfo.value!.socketId, userCamStatus.value)
  closeContextMenu()
}
</script>
