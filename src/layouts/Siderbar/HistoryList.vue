<script lang="ts" setup>
import ActionArea from './ActionArea.vue'
import { useRecordStore } from '@/store'
import type { HistoryBlock } from '@/utils/IDB/types'

const emit = defineEmits(['close'])
const recordStore = useRecordStore()
const { setSessionId, setFlowList } = recordStore
const { historyList, sessionId } = storeToRefs(recordStore)

const filterKey = ref('')

const currentList = computed(() => historyList.value.filter(item =>
  item.title.includes(filterKey.value),
),
)

// 跳转到历史会话
function changeSession({ id, flow }: HistoryBlock) {
  setSessionId(id)
  setFlowList(flow)
  emit('close')
}
// 开启新会话
function newChat() {
  setSessionId(null)
  setFlowList([])
  emit('close')
}

// 清空历史记录
function clearAll() {
  const history = bot.value.history
  history.clear()
  history.refresh()
  newChat()
}

// 删除单条历史记录
function delHistory(id: string) {
  const history = bot.value.history
  history.delete(id)
}
</script>

<template>
  <div overflow-hidden relative animate-fade-in>
    <div px-10px mt-10px w-full cursor-pointer fic>
      <div p="x-10px y-4px" w-full rd-12px fic>
        <NInput v-model:value="filterKey" rd-8px :autofocus="false" clearable placeholder="" size="small" />
        <NButton rd-8px type="primary" ml-8px p-8px fc size="small">
          <Icon name="ion:chatbox-outline" :title="t('siderbar.newchat')" :size="18" @click="newChat" />
        </NButton>
      </div>
    </div>
    <NScrollbar ref="scrollEl" h="[calc(100dvh-250px)]" trigger="none">
      <NList bg-transparent hoverable mt-10px :show-divider="false">
        <NListItem v-for="history in currentList" :key="history.id" relative mt-8px>
          <div text-16px fic justify-between w-full @click="changeSession(history)">
            <div overflow-hidden fic w-full>
              <Icon name="ci:chat-dots" :size="18" />
              <span cursor-pointer mx-8px truncate>{{ history.title }}</span>
            </div>

            <div w-25px fc cursor-pointer @click.stop>
              <Icon v-if="sessionId === history.id" name="carbon:dot-mark" :size="18" />
              <n-popconfirm
                v-else
                :on-positive-click="() => delHistory(history.id)"
                :show-icon="false"
              >
                <template #trigger>
                  <Icon name="fluent:delete-12-regular" :size="18" />
                </template>
                {{ t('siderbar.delConfirm') }}
              </n-popconfirm>
            </div>
          </div>
        </NListItem>
      </NList>
    </NScrollbar>
    <!-- <NDivider class="my-8px!" /> -->
    <ActionArea>
      <n-popconfirm v-if="historyList.length" @positive-click="clearAll">
        <template #trigger>
          <div mb-12px w-full cursor-pointer fic>
            <Icon name="majesticons:delete-bin-line" :size="24" mr-8px />
            {{ t('siderbar.clear') }}
          </div>
        </template>
        {{ t('siderbar.clearConfirm') }}
      </n-popconfirm>
    </ActionArea>
  </div>
</template>

<style>
  .n-list-item__main {
    width: 100%;
  }
</style>
