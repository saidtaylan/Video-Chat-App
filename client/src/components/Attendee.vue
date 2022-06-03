<template>
  <div class="flex items-center justify-between w-full">
    <div
        class="flex flex-col lg:flex-row w-full items-start lg:items-center rounded ">
      <video ref="Video" v-bind="props"></video>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps(['autoplay', 'muted', 'controls', 'srcObject'])


</script>
