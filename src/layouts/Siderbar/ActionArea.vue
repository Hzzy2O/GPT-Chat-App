<script setup lang="ts">
import ExportModal from './ExportModal.vue'
import { useRecordStore } from '@/store'

const recordStore = useRecordStore()
const { flowList } = storeToRefs(recordStore)
</script>

<template>
  <div p="x-20px y-8px">
    <slot />
    <ExportModal v-if="flowList.length" />
  </div>
</template>
