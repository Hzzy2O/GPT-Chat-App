<script lang="ts" setup>
import HistoryList from './HistoryList.vue'
import { useUIStore } from '@/store'
import { Bot } from '#/index'
import { isBot } from '@/bot'
import { AutoGPTSider } from '@/bot/autogpt/view'

const UIstore = useUIStore()
const { setShowDrawerSidebar } = UIstore
const { showDrawerSidebar } = storeToRefs(UIstore)

function closeDrawer() {
  setShowDrawerSidebar(false)
}

const { width } = useWindowSize()
const drawWidth = computed(() => {
  return width.value < 450 ? width.value : 375
})
</script>

<template>
  <NDrawer
    lg-display-none
    :on-update:show="closeDrawer"
    :show="showDrawerSidebar"
    :auto-focus="false"
    :width="drawWidth"
    placement="left"
    content-style="padding: 0;"
  >
    <NDrawerContent body-content-style="padding: 0" :native-scrollbar="false">
      <template #header>
        <div w-full fic my-2px justify-between>
          <h2 />
          <Icon
            cursor-pointer
            name="line-md:menu-to-close-alt-transition"
            :size="22"
            @click="closeDrawer"
          />
        </div>
      </template>
      <template v-if="isBot(bot, Bot.autogpt)">
        <AutoGPTSider />
      </template>
      <template v-else>
        <HistoryList @close="closeDrawer" />
      </template>
    </NDrawerContent>
  </NDrawer>
  <NLayoutSider
    :show-collapsed-content="false"
    bg2
    display-none
    lg-display-block
    collapse-mode="transform"
    :collapsed-width="0"
    :width="240"
    show-trigger="bar"
    bordered
  >
    <div h-20px />
    <template v-if="isBot(bot, Bot.autogpt)">
      <AutoGPTSider />
    </template>
    <template v-else>
      <HistoryList @close="closeDrawer" />
    </template>
  </NLayoutSider>
</template>

<style lang="scss">
  .n-drawer-header {
    border: none !important;
  }
  .n-drawer-header__main {
    width: 100%;
  }
  .n-layout-sider--collapsed {
    .n-layout-sider-scroll-container {
      display: none;
    }
  }
</style>
