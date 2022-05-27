<template>
  <div class="flex items-center justify-between w-full">
    <div
        class="flex flex-col lg:flex-row w-full items-start lg:items-center rounded bg-white shadow"
    >
      <video ref="atendeeVideo"></video>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue"

const attendeeVideo = ref(null)

const emit = defineEmits(['update:attendeeVideo'])

onMounted(() => {
emit('update:attendeeVideo', attendeeVideo)
})

</script>
