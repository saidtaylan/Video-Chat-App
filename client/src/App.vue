<script setup lang="ts">
import {useUserStore} from "@/stores/user.store";

const userStore = useUserStore()
const asyncFunc = async () => {
  await userStore.enterSite()
}
asyncFunc()
</script>

<template>
  <RouterView/>
</template>
