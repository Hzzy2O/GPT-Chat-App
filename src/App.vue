<script lang="ts" setup>
import 'highlight.js/styles/github.css'
import { darkTheme, dateZhCN, lightTheme, zhCN } from 'naive-ui'
import { registerCopyable } from '@/components/Copyable'

registerCopyable()

const theme = computed(() => (isDark.value ? darkTheme : lightTheme))

const themeOverrides = {
  common: {
    // primaryColor: '#BD0800',
    // primaryColorHover: '#BD0800',
  },
}
// const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
// const tokens = messages.reduce((acc, cur) => {
//     const tokens = tokenizer.encode(cur.content).bpe.length
//     return acc + tokens
//     // return 0
//   }, 0)
// console.log(tokenizer.encode('hello world').bpe.length)
</script>

<template>
  <NConfigProvider
    h-full
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="theme"
    :theme-overrides="themeOverrides"
  >
    <NMessageProvider :container-style="{ top: '66px' }">
      <RouterView />
    </NMessageProvider>
  </NConfigProvider>
</template>
