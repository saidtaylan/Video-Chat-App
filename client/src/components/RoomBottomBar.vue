<template>
  <div class="mx-auto w-full xl:w-full fixed bottom-0">
    <div class="w-full py-4 sm:px-0 bg-white dark:bg-gray-800 flex justify-center justify-evenly">

      <button role="button" @click="leave"
              class="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 bg-indigo-700 focus:outline-none transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-2 text-sm">
        Leave
      </button>

      <button role="button" @click="changeCameraState"
              class="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 bg-indigo-700 focus:outline-none transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-2 text-sm">
        <video-camera-icon v-if="cameraState"></video-camera-icon>
        <video-camera-off-icon v-else></video-camera-off-icon>
      </button>

      <button role="button" @click="changeMicState"
              class="bg-indigo-700 focus:outline-none transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-2 text-sm"
              :class="micState === !micState ? 'ring-2' : 'ring-2'"
              type="submit">
        <mic-icon v-if="micState"></mic-icon>
        <mic-off-icon v-else></mic-off-icon>

      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue"
import {useCommonStore} from "@/stores/common.store";
import MicIcon from "@/icons/mic.vue"
import MicOffIcon from "@/icons/micOff.vue"
import VideoCameraIcon from "@/icons/videoCamera.vue"
import VideoCameraOffIcon from "@/icons/videoCameraOff.vue"

const commonStore = useCommonStore()

const leave = () => {
  commonStore.getLeaveFunc()
};

const micState = computed(() => {
  return commonStore.getMicState
})
const changeMicState = () => {
  commonStore.setMicState(!micState.value)
  commonStore.getMicStateFunc(micState.value)
}

const cameraState = computed(() => {
  return commonStore.getCameraState
})
const changeCameraState = () => {
  commonStore.setCameraState(!cameraState.value)
  commonStore.getCameraStateFunc(cameraState.value)
}


</script>
