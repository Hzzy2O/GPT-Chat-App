<script setup lang="ts">
import SpeechStatus from './SpeechStatus.vue'
function updateColor(color: string) {
  themeColor.value = color
}
</script>

<template>
  <div absolute bottom-10px left="[calc(50%-110px)]" w-220px bg2 rd-10px z-9 shadow py-8px>
    <SpeechStatus />
  </div>
</template>
