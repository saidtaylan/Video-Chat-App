<template>
  <div class="mx-auto w-full xl:w-full fixed bottom-0">
    <div class="w-full py-4 sm:px-0 bg-white dark:bg-gray-800 flex justify-center justify-evenly">
      <button role="button" @click="leave"
              class="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 bg-indigo-700 focus:outline-none transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-2 text-sm">
        Leave
      </button>

      <button role="button" @click="cameraOnOff"
              class="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 bg-indigo-700 focus:outline-none transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-2 text-sm">
        Camera
      </button>
      <button role="button" @click="micOnOff"
              class="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 bg-indigo-700 focus:outline-none transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-2 text-sm"
              type="submit">Mic
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";

onMounted(() => {
});

const leave = () => {
};

const cameraOnOff = () => {
};

const micOnOff = () => {
};
</script>
