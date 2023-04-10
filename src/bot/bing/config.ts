import type { Bing } from './types'
import { PromptStyle } from './types'
import type { FormConfig } from '@/components/Form/types'

import { enumToOptions } from '@/utils'

// 配置
export const config: Bing.Config = {
  baseURL: 'https://bing_services-1-o5366254.deta.app',
  promptStyle: PromptStyle.balanced,
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
    key: 'promptStyle',
    label: 'config.styleChoose',
    type: 'radio',
    options: enumToOptions(PromptStyle, ([label, value]) => ({
      label: `config.promptStyle.${label}`,
      value,
    })),
  },
]

export const iconName = '#svg-bing'
