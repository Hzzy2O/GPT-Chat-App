<script setup lang="ts">
import StopGenerate from './StopGenerate.vue'
import Regenerate from './Regenerate.vue'
import { useRecordStore, useUIStore } from '@/store'

const UIStore = useUIStore()
const { isGenerating } = storeToRefs(UIStore)
const RecordStore = useRecordStore()
const { flowList } = storeToRefs(RecordStore)

const showStatus = computed(() => isGenerating.value || flowList.value.length)
</script>

<template>
  <div
    v-if="showStatus"
    absolute
    border="1px solid [var(--theme-color)]"
    shadow="[0_0_4px_var(--theme-color)]"
    dark:shadow="[0_0_4px_inset_var(--theme-color)]"
    color="[var(--theme-color)]"
    bg-transparent
    bottom-10px
    left="[calc(50%-110px)]"
    w-200px
    bg2
    rd-10px
    z-9
    py-4px
  >
    <StopGenerate v-if="isGenerating" />
    <Regenerate v-else-if="flowList.length" />
  </div>
</template>
