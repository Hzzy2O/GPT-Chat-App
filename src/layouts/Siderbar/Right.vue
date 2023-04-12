<script lang="ts" setup>
import { useUIStore } from '@/store'
import SettingsForm from '@/layouts/Header/Settings/MainForm.vue'

const UIstore = useUIStore()
const { setShowRightDrawer } = UIstore
const { showRightDrawer } = storeToRefs(UIstore)

function closeDrawer() {
  setShowRightDrawer(false)
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
    :show="showRightDrawer"
    :width="drawWidth"
    :auto-focus="false"
    placement="right"
    content-style="padding: 0;"
  >
    <NDrawerContent :native-scrollbar="true">
      <SettingsForm />
    </NDrawerContent>
  </NDrawer>
  <NLayoutSider
    bg2
    pt-15px
    display-none
    lg-display-block
    :width="320"
    b-l="1px solid stone-1 dark:dark-1"
  >
    <SettingsForm />
  </NLayoutSider>
</template>

<style lang="scss">
  .n-drawer-header__main {
    width: 100%;
  }
</style>
