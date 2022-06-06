<template>
  <info-icon
      class="absolute left-4 right-4 bottom-4 top-4"
      @click="showRoomInfo = !showRoomInfo"
  ></info-icon>
  <dropdown :menuAxisX="dropdownProp.menuAxisY" :menuAxisY="dropdownProp.menuAxisY" v-if="showRoomInfo" >

    <div
        class="flex items-center justify-between rounded text-gray-600 hover:text-gray-800 p-3"
    >
      <p class="text-lg text-center">Davet linki</p>
      <button @click="copyLink">
        Kopyala
        <clipboard-icon></clipboard-icon>
      </button>
    </div>
    <div
        class="flex items-center justify-between rounded text-gray-600 hover:text-gray-800 p-3"
    >
      <p class="text-lg text-center">Parola</p>
      <button @click="copyPasscode">
        Kopyala
        <clipboard-icon></clipboard-icon>
      </button>
    </div>
    <div
        class="flex items-center justify-between rounded text-gray-600 hover:text-gray-800 p-3 "
    >
      <p class="text-lg text-center">Yönetici</p>
      <span class="w-1/3">{{
          "name" in roomStore.getActiveRoom.owner
              ? roomStore.getActiveRoom.owner.name + " " + roomStore.getActiveRoom.owner.lastName
              : roomStore.getActiveRoom.owner.displayName
        }}</span>
    </div>
  </dropdown>
  <room-pass
      v-if="!isOwner && passcode !== roomPasscode"
      @passcode="passcode = $event"
  ></room-pass>
  <div v-else>
    <display-name
        v-if="!userStore.getUser.email && !userStore.getUser.displayName"
        @displayName="typedDisplayName($event)"
    ></display-name>
    <div v-else>
      <Attendees></Attendees>
      <RoomBottomBar></RoomBottomBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onUnmounted, ref, reactive} from "vue";
import {useRoomStore} from "@/stores/room.store";
import {useUserStore} from "@/stores/user.store";
import {useRoute} from "vue-router";

import DisplayName from "@/components/TypeDisplayName.vue";
import RoomPass from "@/components/TypeRoomPass.vue";
import Attendees from "@/components/Attendees.vue";
import RoomBottomBar from "@/components/RoomBottomBar.vue";
import Dropdown from "@/components/dropdown.vue";

import ClipboardIcon from "@/icons/clipboard.vue";
import InfoIcon from "@/icons/info.vue";

import {isOwner} from "@/helpers/isOwner";

const userStore = useUserStore();
const route = useRoute();
const roomStore = useRoomStore();
const roomLink = route.params.link;

const typedDisplayName = (event: string) => {
  userStore.setDisplayName(event);
  roomStore.joinRoom(roomLink as string);
};
roomStore.fetchRoom(roomLink as string);
if (userStore.getUser.name) {
  roomStore.joinRoom(roomLink as string);
}
const roomPasscode = computed(() => {
  return roomStore.getJoinRequestRoom.passcode;
});
const passcode = ref("");

const showRoomInfo = ref(false);

onUnmounted(() => {
  userStore.removeDisplayName();
  roomStore.resetActiveRoom();
});

const copyPasscode = () => {
  navigator.clipboard.writeText(roomStore.getActiveRoom.passcode);
  showRoomInfo.value = !showRoomInfo.value
};

const copyLink = () => {
  navigator.clipboard.writeText(
      `${import.meta.env.VITE_BASE_URL}/r/${roomLink as string}`
  );
  showRoomInfo.value = !showRoomInfo.value
};

const dropdownProp = {menuAxisX: 50, menuAxisY: 50}
</script>
