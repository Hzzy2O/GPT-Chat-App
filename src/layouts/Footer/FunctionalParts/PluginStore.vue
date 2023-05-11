<script setup lang="ts">
import { NInput } from 'naive-ui'
import { Bot } from '#/index'
import openai from '@/bot/openai'
import type { OpenAI } from '@/bot/openai/types'

const isShow = computed(() => openai.config.enableLangchain && openai.config.langchainApi)
const showModal = ref(false)
const toggleModal = async (show: boolean) => {
  if (show)
    await getPluginList()
  showModal.value = show
}

const pluginList = ref<OpenAI.Plugin[]>([])

async function getPluginList() {
  const { enableLangchain, langchainApi } = openai.config
  if (enableLangchain && langchainApi) {
    try {
      const list = await openai.getPlugins()
      pluginList.value = list
    }
    catch (error) {

    }
  }
}

function usePlugin(plugin: OpenAI.Plugin) {
  openai.usePlugin.value = plugin
  toggleModal(false)
}

const pluginUrl = ref('')

const dialog = useDialog()
function openUrlLoader() {
  dialog.create({
    title: t('main.plugin.load'),
    showIcon: false,
    class: 'card-modal',
    content: () => h(NInput,
      {
        placeholder: `please enter${t('main.plugin.url')}`,
        value: pluginUrl.value,
        onUpdateValue: (v: string) => pluginUrl.value = v,
      },
    ),
    positiveText: t('common.confirm'),
    positiveButtonProps: {
      round: true,
      secondary: true,
    },
    onPositiveClick: async () => {
      if (!pluginUrl.value)
        return
      await openai.loadPlugin(pluginUrl.value)
      await getPluginList()
      dialog.destroyAll()
      pluginUrl.value = ''
    },
  })
}

onMounted(() => getPluginList())
</script>

<template>
  <div v-if="isBot(bot, Bot.openai) && isShow" f-icon>
    <div
      v-if="openai.usePlugin.value"
      fc
      flex-gap-5px
      @click="toggleModal(true)"
    >
      {{t('main.plugin.title')}}:
      <div
        v-if="openai.usePlugin.value.logo"
        h-20px
      >
        <NImage
          rd-8px
          shadow-3
          :width="20"
          :height="20"
          :preview-disabled="true"
          :src="openai.usePlugin.value.logo"
          @click="toggleModal(true)"
        />
      </div>
      <Icon
        v-else
        :name="openai.usePlugin.value.icon || 'iconoir:app-notification'"
        :size="20"
        @click="toggleModal(true)"
      />
    </div>
    <Icon
      v-else
      name="raphael:plugin"
      :size="20"
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
      <NButton rd-10px @click="openUrlLoader">
        {{ t('main.plugin.load') }}
      </NButton>
      <NScrollbar
        max-h-470px
        mt-10px
      >
        <div fc md-justify-start flex-gap-40px flex-wrap>
          <NCard
            v-for="plugin in pluginList"
            :key="plugin.name"
            max-h-210px
            bg2
            rd-12px
            w="80%"
            md-w="28%"
            shadow-3
          >
            <div
              v-if="plugin.icon"
              rd-8px
              shadow-3
              p-20px
              w-30px
              h-30px
              fc
            >
              <Icon :name="plugin.icon" :size="30" />
            </div>
            <div
              v-else-if="plugin.logo"
              h-40px
            >
              <NImage
                rd-8px
                shadow-3
                :width="40"
                :height="40"
                :preview-disabled="true"
                :src="plugin.logo"
              />
            </div>
            <label :title="plugin.name" truncate drop-shadow text-16px>
              {{ plugin.name }}
            </label>
            <div w-full text-14px line-clamp-3 mb-10px>
              {{ plugin.description }}
            </div>
            <NButton
              size="small"
              max-w-75px
              secondary
              rd-12px
              text-center
              float-right
              mb-5px
              :type="openai.usePlugin.value?.name === plugin.name ? 'primary' : 'default'"
              @click="usePlugin(plugin)"
            >
              {{ t(`main.plugin.${openai.usePlugin.value?.name === plugin.name ? 'inuse' : 'use'}`) }}
            </NButton>
          </NCard>
        </div>
      </NScrollbar>
    </NModal>
  </div>
</template>
