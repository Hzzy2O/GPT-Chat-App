<script lang="ts" setup>
import MainForm from './MainForm.vue'
</script>

<template>
  <NPopover
    w-285px
    class="!rd-8px"
    overflow-hidden
    relative
    placement="bottom"
    transition-width
    style="padding: 0"
    trigger="click"
  >
    <template #trigger>
      <slot />
    </template>
    <MainForm />
  </NPopover>
</template>
