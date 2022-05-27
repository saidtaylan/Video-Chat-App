<script setup lang="ts">
import {useUserStore} from "@/stores/user.store";

const userStore = useUserStore()
const asyncFunc = async () => {
  await userStore.enterSite()
}
(async function () {
  await asyncFunc()
}())
</script>

<template>
  <RouterView/>
</template>
