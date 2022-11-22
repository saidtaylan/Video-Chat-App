<template>
  <div class="px-4">
    <div
        class="py-5 mx-auto"
    >
      <div
          class="flex flex-col items-start justify-between px-4 lg:items-center lg:px-6 md:px-4 lg:flex-row md:flex-row md:items-center"
      >
        FEZA
        <div
            class="flex items-start justify-start w-full lg:justify-end md:justify-end gap-x-4 lg:mt-0 md:mt-0 mt-7"
        >

          <router-link :to="{name: 'login'}" v-if="!isUserExist"
                       class="bg-indigo-700 rounded hover:bg-indigo-600 transform duration-300 ease-in-out text-sm font-medium px-6 py-4 text-white max-w-[121px] w-full"
          >
            Login
            <login-icon></login-icon>
          </router-link>
          <button @click="userStore.logout()" v-else
                  class="bg-indigo-700 rounded hover:bg-indigo-600 transform duration-300 ease-in-out text-sm font-medium px-6 py-4 text-white max-w-[121px] w-full">
            Logout
            <logout-icon></logout-icon>
          </button>
        </div>
      </div>
      <hr class="my-4 border-gray-300"/>
    </div>
    <div></div>
  </div>
</template>

<script setup lang="ts">

import {useUserStore} from "@/stores/user.store";
import {computed} from "vue"
import LoginIcon from "@/icons/login.vue"
import LogoutIcon from "@/icons/logout.vue"

const userStore = useUserStore()

const isUserExist = computed(() => {
  return !!userStore.getUser.name;
})
</script>
