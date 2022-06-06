<template>
  <div class="2xl:mx-auto dark:bg-gray-900 md:px-20 px-4 md:py-12 py-9">
    <div class="relative rounded-md">
      <img alt="city view" class="w-full h-full rounded-md  object-center object-fill absolute sm:block hidden"
           src="https://i.ibb.co/SBpL1cK/pexels-aleksandar-pasaric-325185-1.png"/>
      <img alt="city view" class="w-full h-full rounded-md absolute object-center object-fill sm:hidden"
           src="https://i.ibb.co/LQpxBsc/mobile.png"/>
      <div
          class="text-xl relative z-20 bg-gradient-to-r from-blue-700 to-transparent w-full h-full z-40 top-0 md:p-16 p-6 flex flex-col justify-between rounded-md ">
        <div>
          <h1 class="md:text-5xl text-3xl font-bold md:leading-10 leading-9 text-white sm:w-auto w-64">Çocuklar İçin Tasarlandı</h1>
          <p class="text-lg leading-6 text-white xl:w-5/12 lg:w-8/12 md:w-10/12  2xl:pr-12 mt-4">Sınıf ortamının sıcaklığını hissetmek için hemen</p>
        </div>
        <div class="md:mt-12 mt-20">
          <button
              class="text-base font-medium leading-4 text-indigo-700 bg-white sm:w-auto w-full rounded p-4 focus:outline-none hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:ring-white"
              @click="createRoom">
            Görüşme başlat
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import {useRoomStore} from "@/stores/room.store";
import {useUserStore} from "@/stores/user.store";
import {useRouter} from "vue-router"
import {ref, computed} from "vue"

const router = useRouter()
const userStore = useUserStore()
const roomStore = useRoomStore()


const createRoom = async () => {
  await roomStore.createRoom()
  const room = roomStore.getActiveRoom
  await router.push({name: 'room', params: {'link': room.link}})
}

</script>