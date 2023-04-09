<script lang="ts" setup>
import { NScrollbar } from 'naive-ui'
import { last } from 'lodash-es'
import ChatBox from './ChatBox/index.vue'
import FloatButton from './FloatButton.vue'
import FloatStatus from './FloatStatus/index.vue'
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

const suggestions = computed(() => last(flowList.value)?.suggests)

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
  <NLayoutContent h="[calc(100dvh-195px)]" bg1 overflow-hidden>
    <NScrollbar ref="scrollEl" h-full trigger="none">
      <NList bg-transparent :show-divider="false">
        <NListItem v-for="flow in flowList" :key="flow.id">
          <ChatBox
            :chat-data="flow"
          />
        </NListItem>
      </NList>
      <!-- <template v-if="suggestions?.length"> -->
      <!--   <NTag v-for="sug in suggestions" :key="sug" round type="primary"> -->
      <!--     {{ sug }} -->
      <!--   </NTag> -->
      <!-- </template> -->
    </NScrollbar>

    <FloatButton />
    <FloatStatus v-if="false" />
  </NLayoutContent>
</template>
