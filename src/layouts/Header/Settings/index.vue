<script lang="ts" setup>
import MainForm from './MainForm.vue'
</script>

<template>
  <n-popover
    w-255px
    placement="bottom"
    transition-width
    style="padding-right: 0"
    trigger="click"
  >
    <template #trigger>
      <slot />
    </template>
    <MainForm />
  </n-popover>
</template>
