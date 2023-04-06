<script lang="ts" setup>
const props = defineProps<{
  isPlay: boolean
}>()
const emit = defineEmits(['play', 'stop'])
const playIcon = computed(() => (props.isPlay ? 'line-md:play-filled-to-pause-transition' : 'line-md:pause-to-play-filled-transition'))

function handlePlay() {
  props.isPlay ? emit('stop') : emit('play')
}
</script>

<template>
  <div animate-fade-in fic>
    <!-- <NPopover trigger="hover" class="!p-0 !rd-10px"> -->
    <!--   <template #trigger> -->
    <!--     <NButton text> -->
    <!--       <Icon name="solar:menu-dots-bold" transition-all :size="18" /> -->
    <!--     </NButton> -->
    <!--   </template> -->
    <!--   <NList hoverable p-5px rd-10px> -->
    <!--     <NListItem class="!p-4px !rd-8px" cursor-pointer /> -->
    <!--   </NList> -->
    <!-- </NPopover> -->
    <Icon v-if="speechInstance.isSupported" :name="playIcon" :size="18" @click="handlePlay" />
  </div>
</template>
