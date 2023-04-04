<script setup lang="ts">
function updateColor(color: string) {
  themeColor.value = color
}

const playIcon = computed(() => (speechInstance.isPlaying.value ? 'line-md:play-filled-to-pause-transition' : 'line-md:pause-to-play-filled-transition'))
</script>

<template>
  <div w-full fc>
    <Icon name="line-md:pause-to-play-filled-transition" :size="16" />
    正在播放
    <Icon name="line-md:close" :size="16" />
  </div>
</template>
