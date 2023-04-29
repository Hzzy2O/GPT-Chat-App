<script lang="ts" setup>
import { NScrollbar } from 'naive-ui'
import CreateForm from '../components/createForm.vue'
import StatusBtn from './StatusBtn.vue'
import MsgBox from './MsgBox.vue'
import { useAutoGPTStore } from '@/store'

const autogptStore = useAutoGPTStore()
const { setCurBotId } = autogptStore
const { curBotId, messageList, running, getCurrentBot } = storeToRefs(autogptStore)

const isFinish = computed(() => {
  const last = messageList.value[messageList.value.length - 1]
  return last?.finish
})
const scrollEl = ref<typeof NScrollbar>()
const { y } = useScroll(scrollEl as unknown as ElRef, { behavior: 'smooth' })
const scrollToB = useThrottleFn(() =>
  setTimeout(() => {
    y.value = scrollEl.value?.scrollbarInstRef.contentRef.scrollHeight
  }, 16),
)

// 滚动到底部
watch(
  [() => messageList.value],
  () => {
    scrollToB()
  },
  { immediate: true, deep: true },
)

async function download() {
  const response = await fetch('http://127.0.0.1:4000/autogpt/download', {
    method: 'post',
  })
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'compressed-files.zip'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <NLayoutContent h="[calc(100dvh-60px)]" bg2 overflow-hidden>
    <div animate-bounce-in w-full h-full fc flex-col>
      <div
        w="80%"
        lg-w="60%"
        bg-white
        transition-all
        w-full
        rd-12px
        overflow-hidden
        shadow-3
        dark:bg-dark-3
        translate-y--50px
      >
        <template v-if="curBotId">
          <NScrollbar
            ref="scrollEl"
            h-480px
            trigger="none"
            relative
          >
            <NList
              bg-transparent
              :show-divider="false"
              p="15px 5px"
              mt-10px
            >
              <NListItem
                class="list-item-card"
              >
                <NThing>
                  <template #avatar>
                    <Icon name="mdi:goal" :size="18" />
                  </template>
                  <template #header>
                    <span mr-5px>{{ t('autogpt.cur_goals') }}:</span>
                  </template>
                  <template #description>
                    <div
                      v-for="(goal, goalNo) in getCurrentBot?.ai_goals"
                      :key="goal"
                    >
                      {{ goalNo + 1 }}. {{ goal }}
                    </div>
                  </template>
                </NThing>
              </NListItem>
              <NListItem
                v-for="(msg, idx) in messageList"
                :key="idx"
                class="list-item-card"
              >
                <MsgBox :message="msg" />
              </NListItem>
            </NList>
            <div v-if="running" fc dark:color-white>
              <span text-18px mr-5px>{{ t('main.chat.thinking') }}</span>
              <iconify-icon width="20" icon="svg-spinners:blocks-wave" />
            </div>
          </NScrollbar>
        </template>
        <CreateForm v-else />
      </div>
      <StatusBtn v-if="!isFinish" />
      <button @click="download">
        download
      </button>
    </div>
  </NLayoutContent>
</template>

<style lang="scss">
  .list-item-card {
    --at-apply: rd-8px text-18px margin-6px bg1 shadow-4 mb-8px;
    padding: 10px 6px !important;
  }
</style>
