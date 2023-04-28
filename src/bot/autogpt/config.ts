import type { AutoGPT } from './types'
import type { FormConfig } from '@/components/Form/types'

// 配置
export const config: AutoGPT.Config = {
  baseURL: 'https://bing_services-1-o5366254.deta.app',
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
