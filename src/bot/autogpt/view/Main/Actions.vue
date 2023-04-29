<script lang="ts" setup>
import CreateForm from '../components/createForm.vue'
import { useAutoGPTStore } from '@/store'

const autogptStore = useAutoGPTStore()
// const { getCurrentBot } = autogptStore
const { running, curBotId, getCurrentBot } = storeToRefs(autogptStore)

const boxCls = computed(() => curBotId.value ? 'top-auto bottom-0' : 'top--420px bottom-auto')
</script>

<template>
  <div animate-bounce-in w-full h-full fc>
    <div
      w="80%"
      lg-w="60%"
      bg-white
      transition-all
      w-full
      rd-12px
      overflow-hidden
      shadow-3
      dark:bg-dark-3
      lg:pt-13px
      lg:px-24px
      p="[12px_13px_38px]"
    >
      <div v-if="curBotId">
        <h2>{{ t('autogpt.cur_goals') }}:</h2>
        <NTag v-for="goal in getCurrentBot?.ai_goals" :key="goal" rd-8px>
          {{ goal }}
        </NTag>
      </div>
      <CreateForm v-else />
    </div>
  </div>
</template>
