<script lang="ts" setup>
import MainForm from './MainForm.vue'
</script>

<template>
  <n-popover
    w-285px
    placement="bottom"
    transition-width
    style="padding: 0"
    trigger="click"
  >
    <template #trigger>
      <slot />
    </template>
    <MainForm />
  </n-popover>
</template>
