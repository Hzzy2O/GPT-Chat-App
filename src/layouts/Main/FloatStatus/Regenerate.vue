<script setup lang="ts">
import { useRecordStore, useUIStore } from '@/store'

const recordStore = useRecordStore()
const { runAbortRef } = recordStore
const { setGenerating } = useUIStore()

function stopGenerate() {
  runAbortRef()
  setGenerating(false)
}
</script>

<template>
  <div w-full fc cursor-pointer @click="stopGenerate">
    <Icon mr-16px name="material-symbols:stop-circle-outline-rounded" :size="18" />
    <span>{{ t('main.chat.stop_generate') }}</span>
  </div>
</template>
