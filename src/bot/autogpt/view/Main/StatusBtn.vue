<script setup lang="ts">
import type { AutoGPTModel } from '@/bot/autogpt'
import { useAutoGPTStore } from '@/store'

const autogpt = bot.value as AutoGPTModel
const autogptStore = useAutoGPTStore()
const { running } = storeToRefs(autogptStore)

function stopOrRun() {
  if (running.value)
    autogpt.stopRun()
  else
    autogpt.startRun()
}
</script>

<template>
  <div
    border="1px solid [var(--theme-color)]"
    shadow="[0_0_4px_var(--theme-color)]"
    dark:shadow="[0_0_4px_inset_var(--theme-color)]"
    color="[var(--theme-color)]"
    bg-transparent
    left="[calc(50%-110px)]"
    w-150px
    bg2
    rd-10px
    z-9
    py-4px
  >
    <div w-full fc cursor-pointer @click="stopOrRun">
      <template v-if="running">
        <Icon mr-16px name="material-symbols:stop-circle-outline-rounded" :size="18" />
        <span>{{ t('autogpt.stop') }}</span>
      </template>
      <template v-else>
        <Icon mr-16px name="line-md:play-filled" :size="18" />
        <span>{{ t('autogpt.run') }}</span>
      </template>
    </div>
  </div>
</template>
