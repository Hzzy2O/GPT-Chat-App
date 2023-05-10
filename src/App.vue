<script lang="ts" setup>
import 'highlight.js/styles/github.css'
import { darkTheme, dateZhCN, lightTheme, zhCN } from 'naive-ui'
import { registerCopyable } from '@/components/Copyable'

registerCopyable()

const theme = computed(() => (isDark.value ? darkTheme : lightTheme))

const providerRef = ref<HTMLElement | null>(null)
const themeColor = computed(() => commonSettings.value.themeColor)
</script>

<template>
  <NConfigProvider
    ref="providerRef"
    :style="`--theme-color: ${themeColor}`"
    h-full
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="theme"
    :theme-overrides="getThemeOverrides"
  >
    <NDialogProvider>
      <NMessageProvider :container-style="{ top: '66px' }">
        <RouterView />
      </NMessageProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>
