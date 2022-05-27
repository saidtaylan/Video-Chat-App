<template>
  <EnterRoom v-if="!user.getUser.email && !user.getUser.displayName" @displayName="typedDisplayName($event)"></EnterRoom>
  <div v-else>
    <Attendees></Attendees>
    <RoomBottomBar/>
  </div>

</template>

<script setup lang="ts">

import {useRoomStore} from "@/stores/room.store";
import {useRoute} from "vue-router"
import EnterRoom from "@/components/EnterRoomSettings.vue"
import {useUserStore} from "@/stores/user.store";
import Attendees from '@/components/Attendees.vue'
import RoomBottomBar from '@/components/RoomBottomBar.vue'

const user = useUserStore()
const route = useRoute()
const roomStore = useRoomStore()
const roomLink = route.params.link
const typedDisplayName = (event: string) => {
  user.setDisplayName(event)
  roomStore.joinRoom(roomLink as string)
}


</script>