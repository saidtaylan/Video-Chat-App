<template>

  <div
      class="py-12 bg-gray-700 dark:bg-gray-900 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0 z-50">
    <div role="alert" class="container mx-auto w-11/12 md:w-2/3 max-w-lg">
      <div
          class="relative py-8 px-5 md:px-10 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md rounded border border-gray-400">
        <div class="w-full flex justify-start text-gray-600 mb-3">

        </div>
        <h1 class="text-gray-800 dark:text-white  font-lg font-bold tracking-normal leading-tight mb-4">Odaya girmek
          için odada geçerli olacak olan takma adınızı girin</h1>
        <label for="displayName" class="text-gray-800 dark:text-white  text-sm font-bold leading-tight tracking-normal">Takma
          adınız</label>
        <div class="relative mb-5 mt-2">
          <input type="text" id="displayName"
                 class="text-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-200 dark:border-gray-700 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-16 text-sm border-gray-300 rounded border"
                 v-model="displayName"
          >
        </div>

        <div class="flex items-center justify-start w-full">
          <button
              class="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
              @click="sendDisplayName">Odaya gir
          </button>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup lang="ts">
import {useUserStore} from "@/stores/user.store";
import {ref} from "vue";

const emit = defineEmits(['displayName'])
const user = useUserStore().getUser
const displayName = ref('')
const sendDisplayName = () => {
  emit("displayName", displayName.value)
}

</script>