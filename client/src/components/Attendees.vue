<template>
  <div
    class="container mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 pt-6 gap-8"
  >
    <div class="rounded border-gray-300 dark:border-gray-700 border-dashed border-2">
      <Attendee />
    </div>

    <div class="rounded border-gray-300 dark:border-gray-700 border-dashed border-2">
      <Attendee />
    </div>
  </div>
</template>

<script setup>
import Attendee from "@/components/Attendee.vue";
</script>
