<template>
  <EnterRoom v-if="!user.getUser.displayName" @displayName="typedDisplayName($event)"></EnterRoom>
  <Attendees v-if="user.getUser.email || user.getUser.displayName"></Attendees>
</template>

<script setup lang="ts">

import {useRoomStore} from "@/stores/room.store";
import {useRoute} from "vue-router"
import EnterRoom from "@/components/EnterRoomSettings.vue"
import {useUserStore} from "@/stores/user.store";
import Attendees from '@/components/Attendees.vue'

const user = useUserStore()
const route = useRoute()
const roomStore = useRoomStore()
const typedDisplayName = (event: string) => {
  user.setDisplayName(event)
}
const roomLink = route.params.link
roomStore.joinRoom(roomLink as string)

</script>