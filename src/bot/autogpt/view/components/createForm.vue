<script setup lang="ts">
import type { FormConfig } from '@/components/Form/types'

// 编辑表单
const settingSchema: FormConfig = [
  {
    key: 'ai_name',
    label: 'autogpt.bot_name',
    placeholder: 'asd',
    type: 'input',
    rule: {
      required: true,
    },
  },
  {
    key: 'ai_role',
    label: 'autogpt.bot_role',
    placeholder: 'asd',
    type: 'input',
    rule: {
      required: true,
    },
  },
  {
    key: 'ai_goals',
    label: 'autogpt.bot_goals',
    type: 'dynamicInput',
    rule: {
      required: true,
    },
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
</script>

<template>
  <Form
    label-placement="left"
    :form-model="config"
    :form-items="settingSchema"
    :no-divider="true"
    @handle-change="handleChange"
  />
</template>
