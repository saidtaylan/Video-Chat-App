<template>

  <div>
    <label id="displayName" class="text-sm font-medium leading-none text-gray-800">
      Your nickname in the room
    </label>
    <input aria-labelledby="displayName" v-model="displayName" @keydown.enter="sendDisplayName"
           class="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
           type="text"/>
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
