<script lang="ts" setup>
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
  <Siderbar>
    <div overflow-hidden relative>
      <div px-10px mb-10px w-full cursor-pointer fic>
        <div p="x-10px y-4px" w-full rd-12px fic>
          <NButton w-full rd-6px fc type="primary" dashed>
            <Icon mr-8px name="ic:round-add-to-queue" :title="t('siderbar.newchat')" :size="18" @click="newChat" />
            <span>{{ t('autogpt.create') }}</span>
          </NButton>
        </div>
      </div>
      <NScrollbar ref="scrollEl" h="[calc(100dvh-250px)]" trigger="none">
        <NList bg-transparent :show-divider="false">
          <NListItem v-for="history in currentList" :key="history.id" relative class="!px-12px !py-4px">
            <div
              text-16px
              fic
              justify-between
              hover:bg-zinc-2
              dark="hover-bg-zinc-8"
              rd-10px
              p-8px
              w-full
              cursor-pointer
              @click="changeSession(history)"
            >
              <div overflow-hidden fic w-full>
                <Icon name="ci:chat-dots" :size="18" />
                <span mx-8px truncate>{{ history.title }}</span>
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
    </div>
  </Siderbar>
</template>

<style>
  .n-list-item__main {
    width: 100%;
  }
</style>
