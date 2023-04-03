<script setup lang="ts">
import { useUIStore } from '@/store'

const { error, success } = useMessage()

const UIStore = useUIStore()
const { showTokenModal } = storeToRefs(UIStore)
const { setShowTokenModal } = UIStore

const input = ref('')

const placeholder = computed(() => isOpenai(bot.value) ? 'config.openai_key_placeholder' : 'config.bing_key_placeholder')

function onConfirm() {
  try {
    if (!input.value)
      throw new Error('invalid input')
    if (isOpenai(bot.value)) {
      bot.value.apiKey = input.value
    }
    else {
      const json = JSON.parse(input.value)
      if (!Array.isArray(json))
        throw new Error('Invalid JSON')
      bot.value.apiKey = JSON.stringify(json, null, 0)
    }
    success(t('config.set_success'))
    input.value = ''
    setShowTokenModal(false)
  }
  catch (err) {
    error(t('config.invalid_input'))
  }
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
