<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div>
    {{ text }}
  </div>
</template>
