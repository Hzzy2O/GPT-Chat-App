<script lang="ts" setup>
import { Footer, Header, Main, RightSider, Siderbar } from '@/layouts'
import { registerHLDB } from '@/utils/IDB'
import { useUIStore } from '@/store'

const UIStore = useUIStore()
const { fixedRight } = storeToRefs(UIStore)

registerMessageApi()
registerHLDB()
</script>

<template>
  <NLayout h-full has-sider>
    <Siderbar />
    <NLayout>
      <Header />
      <Main />
      <Footer />
    </NLayout>
    <RightSider v-if="fixedRight" />
  </NLayout>
</template>
