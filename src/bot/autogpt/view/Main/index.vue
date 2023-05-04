<script lang="ts" setup>
import type { NScrollbar } from 'naive-ui'
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

const scrollEl = ref<typeof NScrollbar>()
const { y } = useScroll(scrollEl as unknown as ElRef, { behavior: 'smooth' })
const scrollToB = useThrottleFn(() =>
  setTimeout(() => {
    y.value = scrollEl.value?.scrollbarInstRef.contentRef.scrollHeight
  }, 16),
)

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

// 滚动到底部
watch(
  [() => messageList.value],
  () => {
    scrollToB()
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
          <!-- <DynamicScroller -->
          <!--   :items="datal" -->
          <!--   key-field="reply_json" -->
          <!--   :min-item-size="54" -->
          <!--   p="15px 5px" -->
          <!-- > -->
          <!--   <NListItem -->
          <!--     class="list-item-card" -->
          <!--   > -->
          <!--     <NThing> -->
          <!--       <template #avatar> -->
          <!--         <Icon name="mdi:goal" :size="18" /> -->
          <!--       </template> -->
          <!--       <template #header> -->
          <!--         <span mr-5px>{{ t('autogpt.cur_goals') }}:</span> -->
          <!--       </template> -->
          <!--       <template #description> -->
          <!--         <div -->
          <!--           v-for="(goal, goalNo) in getCurrentBot?.ai_goals" -->
          <!--           :key="goal" -->
          <!--         > -->
          <!--           {{ goalNo + 1 }}. {{ goal }} -->
          <!--         </div> -->
          <!--       </template> -->
          <!--     </NThing> -->
          <!--   </NListItem> -->
          <!--   <template #default="{ item, index, active }"> -->
          <!--     <DynamicScrollerItem -->
          <!--       :item="item" -->
          <!--       :active="active" -->
          <!--       :size-dependencies="[ -->
          <!--         item.reply_json?.text, -->
          <!--       ]" -->
          <!--       :data-index="index" -->
          <!--       class="list-item-card" -->
          <!--       m-10px -->
          <!--     > -->
          <!--       <MsgBox :message="item" /> -->
          <!--     </DynamicScrollerItem> -->
          <!--   </template> -->
          <!-- </DynamicScroller> -->
          <NScrollbar
            ref="scrollEl"
            h-520px
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
      <div
        v-if="curBotId"
        mt-10px
        fic
        w="85%"
        lg-w="80%"
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
