<script setup lang="ts">
defineProps<{ items: string[] }>()
</script>

<template>
  <ul class="flex flex-wrap gap-2">
    <li v-for="item in items" :key="item" class="rounded-badge bg-primary-soft px-3 py-1 text-small font-semibold text-primary-strong">{{ item }}</li>
  </ul>
</template>
