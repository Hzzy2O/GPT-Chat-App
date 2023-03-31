<script lang="ts" setup>
import { NScrollbar } from 'naive-ui'
import ChatBox from './ChatBox.vue'
import { useRecordStore } from '@/store'

const recordStore = useRecordStore()
const { flowList } = storeToRefs(recordStore)

const scrollEl = ref<typeof NScrollbar>()
const { y } = useScroll(scrollEl as unknown as ElRef, { behavior: 'smooth' })
const scrollToB = useThrottleFn(() =>
  setTimeout(() => {
    y.value = scrollEl.value?.scrollbarInstRef.contentRef.scrollHeight
  }, 16),
)

// 滚动到底部
watch(
  [() => flowList.value],
  () => {
    scrollToB()
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <NLayoutContent h="[calc(100dvh-245px)]" overflow-hidden>
    <NScrollbar ref="scrollEl" trigger="none">
      <NList bg-transparent :show-divider="false">
        <NListItem v-for="flow in flowList" :key="flow.id">
          <ChatBox
            :chat-data="flow"
          />
        </NListItem>
      </NList>
    </NScrollbar>
  </NLayoutContent>
</template>
