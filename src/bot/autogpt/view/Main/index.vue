<script lang="ts" setup>
import StatusBtn from './StatusBtn.vue'
import { useAutoGPTStore } from '@/store'

const autogptStore = useAutoGPTStore()
const { curBotId, messageList, running } = storeToRefs(autogptStore)
</script>

<template>
  <NLayoutContent h="[calc(100dvh-195px)]" bg2 overflow-hidden>
    <div v-if="!curBotId" animate-fade-in w-full h-full fic pt-100px flex-col>
      <Icon name="bi:robot" :size="90" mb-20px />
      <span text-20px>{{ t('autogpt.nodata') }}</span>
    </div>
    <NScrollbar v-else ref="scrollEl" h-full trigger="none">
      <NList
        bg-transparent
        :show-divider="false"
      >
        <NListItem v-for="msg in messageList" :key="msg">
          {{ msg }}
          <ChatBox
            :chat-data="msg"
          />
        </NListItem>
      </NList>
      <div v-if="running" fc dark:color-white>
        <span text-18px mr-5px>{{ t('main.chat.thinking') }}</span>
        <iconify-icon width="20" icon="svg-spinners:blocks-wave" />
      </div>
      <StatusBtn />
    </NScrollbar>
  </NLayoutContent>
</template>
