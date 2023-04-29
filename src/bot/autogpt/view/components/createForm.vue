<script setup lang="ts">
import { create } from '../../api'
import type { AutoGPTModel } from '@/bot/autogpt'
import type { FormConfig, FormItem } from '@/components/Form/types'
import { useAutoGPTStore } from '@/store'

const { error } = useMessage()

const { setCurBotId } = useAutoGPTStore()

// 编辑表单
const settingSchema: FormConfig = [
  {
    key: 'ai_name',
    label: 'autogpt.bot_name',
    placeholder: 'autogpt.bot_name_placeholder',
    type: 'input',
  },
  {
    key: 'ai_role',
    label: 'autogpt.bot_role',
    placeholder: 'autogpt.bot_role_placeholder',
    type: 'input',
  },
  {
    key: 'ai_goals',
    label: 'autogpt.bot_goals',
    type: 'dynamicInput',
    max: 5,
    min: 1,
  },
]

const config = reactive({
  ai_name: '',
  ai_role: '',
  ai_goals: [''],
})

function handleChange(key: string, value: any) {
  Reflect.set(config, key, value)
}
const loading = ref(false)

async function submit() {
  const pass = settingSchema.find(({ key }: FormItem) =>
    Array.isArray(config[key])
      ? !config[key].filter((v: string) => !!v).length
      : !config[key],
  )
  if (pass)
    return error(t('config.placeholder') + t(pass.label))
  loading.value = true

  try {
    const { data } = await create(toRaw(config))
    const { id } = data.value
    const autogpt = bot.value as AutoGPTModel

    autogpt.getAllBot()
    autogpt.setRunBot(id)
  }
  catch (error) {
    // error(error.message)
  }
  loading.value = false
}
</script>

<template>
  <div p="20px 25px">
    <div animate-fade-in w-full h-full fic flex-col>
      <Icon name="bi:robot" :size="60" mb-10px />
      <span text-15px>{{ t('autogpt.nodata') }}</span>
    </div>
    <Form
      :form-model="config"
      :form-items="settingSchema"
      :no-divider="true"
      @handle-change="handleChange"
    />
    <div fc>
      <NButton :loading="loading" rd-10px type="primary" float-right @click="submit">
        {{ $t('autogpt.create') }}
      </nbutton>
    </div>
  </div>
</template>
