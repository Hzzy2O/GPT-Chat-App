<script lang="ts" setup>
import { NScrollbar } from 'naive-ui'
import { last } from 'lodash-es'
import ChatBox from './ChatBox/index.vue'
import FloatButton from './FloatButton.vue'
import { useRecordStore, useUIStore } from '@/store'

const recordStore = useRecordStore()
const { flowList } = storeToRefs(recordStore)
const UIStore = useUIStore()
const { isGenerating } = storeToRefs(UIStore)

const scrollEl = ref<typeof NScrollbar>()
const { y } = useScroll(scrollEl as unknown as ElRef, { behavior: 'smooth' })
const scrollToB = useThrottleFn(() =>
  setTimeout(() => {
    y.value = scrollEl.value?.scrollbarInstRef.contentRef.scrollHeight
  }, 16),
)

const suggestions = computed(() => last(flowList.value)?.suggests)
const suggestionRef = ref<HTMLDivElement>()
const { height: suggestionHeight } = useElementSize(suggestionRef)

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
  <NLayoutContent h="[calc(100dvh-195px)]" bg2 overflow-hidden>
    <div v-if="!flowList.length" w-full h-full fc flex-col>
      <Icon name="bi:robot" :size="90" mb-20px />
      <span text-20px>{{ t('main.chat.nodata') }}</span>
    </div>
    <NScrollbar v-else ref="scrollEl" h-full trigger="none">
      <NList
        id="chatList"
        bg-transparent
        :style="`min-height: calc(100dvh - ${suggestionHeight + 200}px)`"
        :show-divider="false"
      >
        <NListItem v-for="flow in flowList" :key="flow.id">
          <ChatBox
            :chat-data="flow"
          />
        </NListItem>
        <div v-if="isGenerating" fc dark:color-white>
          <span text-18px mr-5px>{{ t('main.chat.thinking') }}</span>
          <iconify-icon width="20" icon="svg-spinners:blocks-wave" />
        </div>
      </NList>
      <template v-if="suggestions?.length">
        <div ref="suggestionRef" w-full justify-end fic flex="gap-8px wrap">
          <label v-for="sug in suggestions" :key="sug" :title="sug" @click="setQueryInputVal(sug)">
            <NTag cursor-pointer mx-8px round type="primary" max-w-260px truncate>
              {{ sug }}
            </NTag>
          </label>
        </div>
      </template>
    </NScrollbar>

    <FloatButton />
  </NLayoutContent>
</template>
