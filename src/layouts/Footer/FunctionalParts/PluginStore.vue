<script setup lang="ts">
import { Bot } from '#/index'
import openai from '@/bot/openai'
import type { OpenAI } from '@/bot/openai/types'

const pluginSet = computed(() => new Set(openai.usePlugins.value.map(p => p.name)))

const showIcon = ref(false)
const showModal = ref(false)
const toggleModal = (show: boolean) => {
  showModal.value = show
}

const pluginList = ref<OpenAI.Plugin[]>([])

async function getPluginList() {
  const { enableLangchain, langchainApi } = openai.config
  if (enableLangchain && langchainApi)
    showIcon.value = true
  else return

  try {
    const list = await openai.getPlugins()
    pluginList.value = list
  }
  catch (error) {

  }
}

function useOrDisable(plugin: OpenAI.Plugin) {
  const { usePlugins } = openai
  const index = usePlugins.value.findIndex(p => p.name === plugin.name)
  if (index > -1)
    usePlugins.value.splice(index, 1)

  else usePlugins.value.push(plugin)
}

getPluginList()
</script>

<template>
  <div v-if="isBot(bot, Bot.openai) && showIcon" f-icon>
    <Icon
      :title="t('common.speechToTxt')"
      name="raphael:plugin"
      :size="22"
      @click="toggleModal(true)"
    />
    <NModal
      :show="showModal"
      preset="card"
      card-modal
      max-w-800px
      rd-10px
      :show-icon="false"
      :title="t('main.plugin.store')"
      @update-show="toggleModal"
    >
      <div fic justify-start flex-gap-40px flex-wrap>
        <NCard
          v-for="plugin in pluginList"
          :key="plugin.name"
          max-h-200px
          bg2
          rd-12px
          w="80%"
          md-w="28%"
        >
          <div rd-8px shadow-3 p-20px w-30px h-30px fc>
            <Icon v-if="plugin.icon" :name="plugin.icon" :size="30" />
          </div>
          <div drop-shadow text-16px>
            {{ plugin.name }}
          </div>
          <div w-full text-14px line-clamp-3 mb-10px>
            {{ plugin.description }}
          </div>
          <NButton
            size="small"
            w-65px
            secondary
            rd-12px
            text-center
            float-right
            @click="useOrDisable(plugin)"
          >
            {{ pluginSet.has(plugin.name) ? t('main.plugin.disable') : t('main.plugin.use') }}
          </NButton>
        </NCard>
      </div>
    </NModal>
  </div>
</template>
