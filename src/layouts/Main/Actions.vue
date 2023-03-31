<script lang="ts" setup>
const isExpand = ref(false)
const toggleExpand = useToggle(isExpand)
const iconCls = computed(() => (isExpand.value ? 'icon-park-outline:refraction' : 'icon-park-twotone:refraction'))

const isPlay = ref(false)
const togglePlay = useToggle(isPlay)
const playIcon = computed(() => (isPlay.value ? 'line-md:play-filled-to-pause-transition' : 'line-md:pause-to-play-filled-transition'))
</script>

<template>
  <div animate-fade-in fic overflow-hidden relative h-20px>
    <Icon :name="iconCls" transition-all :size="18" @click="toggleExpand(!isExpand)" />

    <div fc ml-6px relative>
      <div fc>
        <Icon :name="playIcon" class="rotate-0" transition-all :size="18" @click="togglePlay(!isPlay)" />
        <span class="ml-2">Add</span>
      </div>
      <div class="flex items-center">
        <Icon name="line-md:plus" class="rotate-0" transition-all :size="18" />
        <span class="ml-2">Add</span>
      </div>
    </div>
  </div>
</template>
