import type { AutoGPT } from './types'
import type { FormConfig } from '@/components/Form/types'

// 配置
export const config: AutoGPT.Config = {
  baseURL: 'http://127.0.0.1:4000',
  autorun: true,
}

// 编辑表单
export const settingSchema: FormConfig = [
  {
    key: 'baseURL',
    label: 'config.baseURL',
    type: 'input',
    prefix: 'http://',
    rule: {
      required: true,
    },
  },
  {
    key: 'autorun',
    label: 'autogpt.autorun',
    desc: 'autogpt.autorun_desc',
    type: 'switch',
  },
]

export const iconName = 'carbon:machine-learning-model'
