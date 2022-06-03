<template>
  <info-icon class="absolute left-4 right-4 bottom-4 top-4" @click="showRoomInfo = !showRoomInfo"></info-icon>
  <dropdown v-show="showRoomInfo">
      <div
          class="flex items-center justify-between rounded text-gray-600 hover:text-gray-800 p-3"
      >
        <p class="text-lg text-center">Oda Bilgisi</p>
        >
      </div>
  </dropdown>
  <room-pass v-if="!isOwner && passcode !== roomPasscode" @passcode="passcode = $event"></room-pass>
  <div v-else>
    <display-name v-if="!userStore.getUser.email && !userStore.getUser.displayName"
                  @displayName="typedDisplayName($event)"></display-name>
    <div v-else>
      <Attendees></Attendees>
      <RoomBottomBar></RoomBottomBar>
    </div>
  </div>

</template>

<script setup lang="ts">

import {useRoomStore} from "@/stores/room.store";
import {useRoute} from "vue-router"
import DisplayName from "@/components/TypeDisplayName.vue"
import RoomPass from "@/components/TypeRoomPass.vue"
import {useUserStore} from "@/stores/user.store";
import Attendees from '@/components/Attendees.vue'
import RoomBottomBar from '@/components/RoomBottomBar.vue'
import InfoIcon from '@/icons/info.vue'
import {computed, onUnmounted, ref} from "vue";
import Dropdown from "@/components/dropdown.vue"

const userStore = useUserStore()
const route = useRoute()
const roomStore = useRoomStore()
const roomLink = route.params.link

const typedDisplayName = (event: string) => {
  userStore.setDisplayName(event)
  roomStore.joinRoom(roomLink as string)
}
roomStore.fetchRoom(roomLink as string)
if (userStore.getUser.name) {
  roomStore.joinRoom(roomLink as string)
}

const roomPasscode = computed(() => {
  return roomStore.getJoinRequestRoom.passcode
})
const passcode = ref('')

const isOwner = computed(() => {
  return roomStore.getJoinRequestRoom.owner === userStore.getUser.onlineId
})

const showRoomInfo = ref(false)

onUnmounted(() => {
  userStore.removeDisplayName()
  roomStore.resetActiveRoom()
})

</script>