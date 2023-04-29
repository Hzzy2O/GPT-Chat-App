<script lang="ts" setup>
import type { ComputedRef } from 'vue'
import type { AutoGPTModel } from '../..'
import type { AutoGPT } from '../../types'
import { useAutoGPTStore } from '@/store'

const autogpt = bot as ComputedRef<AutoGPTModel>

autogpt.value.getAllBot()

const autoGPTStore = useAutoGPTStore()
// const {  } = autoGPTStore
const { botList, curBotId } = storeToRefs(autoGPTStore)

const iconList = [
  {
    name: 'fluent-emoji:rocket',
    label: '运行',
  },
]

function handleAction(name: typeof iconList[number]['name']) {
  switch (name) {
    case 'fl':
      break
    default:
      break
  }
}

// const currentList = computed(() => historyList.value.filter(item =>
//   item.title.includes(filterKey.value),
// ),
// )

// // 跳转到历史会话
function changeBot({ id }: AutoGPT.GPTInfo) {
  autogpt.value.setRunBot(id)
}

function newBot() {
  autogpt.value.resetBot()
}

// // 清空历史记录
// function clearAll() {
//   const bot = bot.value.history
//   history.clear()
//   history.refresh()
//   newChat()
// }

// // 删除单条历史记录
// function delHistory(id: string) {
//   const history = bot.value.history
//   history.delete(id)
// }
</script>

<template>
  <Siderbar>
    <div overflow-hidden relative>
      <div px-10px mb-10px w-full cursor-pointer fic>
        <div p="x-10px y-4px" w-full rd-12px fic>
          <NButton w-full rd-6px fc type="primary" dashed @click="newBot">
            <Icon mr-8px name="ic:round-add-to-queue" :size="18" />
            <span>{{ t('autogpt.create_new') }}</span>
          </NButton>
        </div>
      </div>
      <NScrollbar ref="scrollEl" h="[calc(100dvh-150px)]" trigger="none">
        <NList bg-transparent :show-divider="false">
          <NListItem v-for="botInfo in botList" :key="botInfo.id" relative class="!px-18px !py-6px">
            <NTag
              text-16px
              fic
              transition-all
              :type="curBotId === botInfo.id ? 'primary' : 'default'"
              secondary
              justify-between
              hover-scale-103
              rd-10px
              p-8px
              w-full
              cursor-pointer
              h-auto
              class="shadow-[0_0_4px_var(--theme-color)]"
              @click="changeBot(botInfo)"
            >
              <NThing :title="botInfo.ai_name" content-style="margin-top: 10px;">
                <template #avatar>
                  <Icon
                    :name="curBotId === botInfo.id ? 'mdi:robot-happy-outline' : 'mdi:robot'"
                    :size="26"
                  />
                </template>
                <template #description>
                  <span truncate>{{ botInfo.ai_role }}</span>
                </template>
                <template #footer>
                  <!-- <NSpace size="small" style="margin-top: 4px"> -->
                  <!--   <Icon -->
                  <!--     v-for="(icon) in iconList" -->
                  <!--     :key="icon.name" -->
                  <!--     :name="icon.name" -->
                  <!--     :size="18" -->
                  <!--     @click="handleAction(icon.name)" -->
                  <!--   /> -->
                  <!-- </NSpace> -->
                </template>
              </NThing>
            </NTag>
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
