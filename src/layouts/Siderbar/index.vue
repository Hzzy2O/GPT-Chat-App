<script lang="ts" setup>
import HistoryList from './HistoryList.vue'
import { useUIStore } from '@/store'

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
          <h2>{{ t('siderbar.title') }}</h2>
          <Icon
            cursor-pointer
            name="line-md:menu-to-close-alt-transition"
            :size="22"
            @click="closeDrawer"
          />
        </div>
      </template>
      <HistoryList @close="closeDrawer" />
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
    <div text-18px pt-20px px-18px pb-10px>
      {{ t('siderbar.title') }}
    </div>
    <HistoryList />
  </NLayoutSider>
</template>

<style lang="scss">
  .n-drawer-header__main {
    width: 100%;
  }
  .n-layout-sider--collapsed {
    .n-layout-sider-scroll-container {
      display: none;
    }
  }
</style>
