<template>
  <div class=" z-50"
       :style="[baseStyle]"
  >
    <div
        class=" w-max rounded outline-none bg-white shadow-md"
    >
      <div class="rounded w-full px-3 py-2 bg-white shadow-lg"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";

const props = defineProps(['menuAxisX', 'menuAxisY'])

const baseStyle = computed(() => {
  return {
    'position': 'absolute',
    'left': props.menuAxisX + 'px',
    'top': props.menuAxisY + 'px',
  }
})
</script>