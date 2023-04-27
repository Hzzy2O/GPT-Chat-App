<script lang="ts" setup>
import { Footer, Header, Main, RightSider, Siderbar } from '@/layouts'
import { AutoGPTFooter, AutoGPTMain, AutoGPTSider } from '@/bot/autogpt/view'
import { registerHLDB } from '@/utils/IDB'
import { useUIStore } from '@/store'
import { isBot } from '@/bot'
import { Bot } from '#/index'

const UIStore = useUIStore()
const { fixedRight } = storeToRefs(UIStore)

registerMessageApi()
registerHLDB()
</script>

<template>
  <NLayout h-full has-sider>
    <template v-if="isBot(bot, Bot.autogpt)">
      <AutoGPTSider />
      <NLayout>
        <Header />
        <AutoGPTMain />
        <AutoGPTFooter />
      </NLayout>
      <RightSider v-if="fixedRight" />
    </template>
    <template v-else>
      <Siderbar />
      <NLayout>
        <Header />
        <Main />
        <Footer />
      </NLayout>
    </template>
  </NLayout>
</template>
