<script setup lang="ts">
import { Bot } from '#/index'
import { isBot } from '@/bot'
import { useUIStore } from '@/store'

const { success } = useMessage()

const UIStore = useUIStore()
const { showTokenModal } = storeToRefs(UIStore)
const { setShowTokenModal } = UIStore

const input = ref('')

const placeholder = computed(() => `${t('config.placeholder') + bot.value.name} api key`)

function onConfirm() {
  try {
    if (!input.value)
      throw new Error('invalid input')
    if (isBot(bot.value, Bot.openai)) {
      bot.value.apiKey.value = input.value
    }
    else {
      const json = JSON.parse(input.value)

      bot.value.apiKey.value = JSON.stringify(json, null, 0)
    }
  }
  catch (err) {
    bot.value.apiKey.value = JSON.stringify([{
      name: '_U',
      value: input.value,
    }], null, 0)
  }
  success(t('config.set_success'))
  input.value = ''
  setShowTokenModal(false)
}
</script>

<template>
  <NModal
    :show="showTokenModal"
    :mask-closable="false"
    preset="dialog"
    card-modal
    :title="t('config.setApiKey')"
    :show-icon="false"
    :positive-text="t('common.confirm')"
    :negative-text="t('common.cancel')"
    :positive-button-props="{ round: true }"
    :negative-button-props="{ round: true }"
    @positive-click="onConfirm"
    @negative-click="setShowTokenModal(false)"
    @close="setShowTokenModal(false)"
  >
    <div>
      <NInput
        v-model:value="input"
        type="textarea"
        :placeholder="t(placeholder)"
        rd-10px
        :autosize="{
          minRows: 3,
          maxRows: 5,
        }"
      />
    </div>
  </nmodal>
</template>
