<script lang="ts" setup>
import CreateForm from '../components/createForm.vue'
import StatusBtn from './StatusBtn.vue'
import FileModal from './FileModal.vue'
import MsgBox from './MsgBox.vue'
import { useAutoGPTStore } from '@/store'

const autogptStore = useAutoGPTStore()
const { curBotId, messageList, running, getCurrentBot } = storeToRefs(autogptStore)

const isFinish = computed(() => {
  const last = messageList.value[messageList.value.length - 1]
  return last?.finish || getCurrentBot.value?.finish
})

const fileModal = ref<typeof FileModal | null>(null)
function openFileModal() {
  fileModal.value?.open()
}
const datal = computed(() => messageList.value.map((item, index) => {
  return {
    ...item,
    id: index,
  }
}))

const scroller = ref<any>()

function toBottom() {
  scroller.value?.scrollToBottom()
}
// 滚动到底部
watch(
  [() => messageList.value],
  () => {
    toBottom()
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <NLayoutContent h="[calc(100dvh-60px)]" bg2>
    <div w-full h-full relative overflow-hidden fc flex-col>
      <div
        animate-bounce-in
        w="85%"
        max-w-660px
        bg-white
        transition-all
        w-full
        rd-12px
        overflow-hidden
        shadow-3
        dark:bg-dark-3
      >
        <template v-if="curBotId">
          <DynamicScroller
            ref="scroller"
            :items="datal"
            :min-item-size="54"
            :emit-update="true"
            p="15px 5px"
            h-520px
            overflow-y-scroll
            class="!scroll-t"
            overflow-x-hidden
            @resize="toBottom"
          >
            <template #before>
              <NThing class="list-item-card" m-10px>
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
            </template>
            <template #after>
              <div v-if="running" fc dark:color-white>
                <span text-18px mr-5px>{{ t('main.chat.thinking') }}</span>
                <iconify-icon width="20" icon="svg-spinners:blocks-wave" />
              </div>
            </template>
            <template #default="{ item, index, active }">
              <DynamicScrollerItem
                :item="item"
                :active="active"
                :size-dependencies="[
                  item.reply_json.thoughts,
                ]"
                :data-index="index"
                :data-active="active"
                p-10px
              >
                <MsgBox
                  class="list-item-card"
                  :message="item"
                />
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>
        </template>
        <CreateForm v-else />
      </div>
      <div
        v-if="curBotId"
        mt-10px
        fic
        w="85%"
        max-w-660px
        px-20px
        justify-end
      >
        <NButton text @click="openFileModal">
          <Icon title="file" name="clarity:directory-solid" :size="22" />
        </NButton>
      </div>
      <StatusBtn v-if="curBotId && !isFinish" mt-20px />
    </div>
    <FileModal ref="fileModal" />
  </NLayoutContent>
</template>

<style lang="scss">
  .list-item-card {
    --at-apply: rd-8px text-18px margin-6px bg1 shadow-4 mb-8px;
    padding: 10px 6px !important;
  }
</style>
