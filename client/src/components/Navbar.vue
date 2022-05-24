<template>
  <div class="px-4 py-12">
    <div
        class="py-7 bg-gray-50 lg:max-w-[1124px] w-full md:max-w-[696px] max-w-[343px] mx-auto"
    >
      <div
          class="flex flex-col items-start justify-between px-4 lg:items-center lg:px-6 md:px-4 lg:flex-row md:flex-row md:items-center"
      >
        FEZA
        <div
            class="flex items-start justify-start w-full lg:justify-end md:justify-end gap-x-4 lg:mt-0 md:mt-0 mt-7"
        >
          <button
              class="bg-indigo-700 rounded hover:bg-indigo-600 transform duration-300 ease-in-out text-sm font-medium px-6 py-4 text-white max-w-[121px] w-full"
          >
            Join a Room
          </button>
          <button
              class="bg-white border-indigo-700 rounded hover:bg-gray-50 transform duration-300 ease-in-out text-sm font-medium px-6 py-4 text-indigo-700 border max-w-[81px] w-full"
          >
            Create Room
          </button>
          <router-link :to="{name: 'login'}" v-if="!isUserExist"
                       class="bg-indigo-700 rounded hover:bg-indigo-600 transform duration-300 ease-in-out text-sm font-medium px-6 py-4 text-white max-w-[121px] w-full"
          >
            Login
          </router-link>
        </div>
      </div>
      <hr class="my-4 border-gray-300"/>
    </div>
    <div></div>
  </div>
</template>

<script setup>

import {useUserStore} from "@/stores/user.store";
import {computed} from "vue"

const userStore = useUserStore()
const isUserExist = computed(() => {
  if (userStore.getUser.name) return true
  return false

})
</script>
