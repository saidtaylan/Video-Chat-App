<template>
  <div
      class="py-12 bg-gray-700 dark:bg-gray-900 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0 z-50"
      id="modal">
    <div role="alert" class="container mx-auto w-11/12 md:w-2/3 max-w-lg">
      <div
          class="relative py-8 px-5 md:px-10 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md rounded border border-gray-400">
        <h1 class="text-gray-800 dark:text-white  font-lg font-bold tracking-normal leading-tight mb-4">Odanın parolasını
          girin</h1>
        <label for="pass" class="text-gray-800 dark:text-white  text-sm font-bold leading-tight tracking-normal">
          Parola</label>
        <input id="pass" v-model="passcode"
               class="mb-5 mt-2 text-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-200 dark:border-gray-700 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
        />

        <div class="flex items-center justify-start w-full">
          <button
              @click="tryPass"
              class="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm">
            Odaya gir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useRoomStore} from "@/stores/room.store";
import {useUserStore} from "@/stores/user.store";

const emit = defineEmits(["passcode"])

const roomStore = useRoomStore()
const passcode = ref('')

const tryPass = () => {
  emit('passcode', passcode.value)
}
</script>

<style scoped>
</style>