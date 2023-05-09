import type { OpenAI } from './types'
import { modelSelectLabel } from './components'
import { modelList } from './dataSource'
import type { FormConfig } from '@/components/Form/types'

// 配置
export const config: OpenAI.Config = {
  baseURL: 'https://api.openai.com',
  modelType: 'gpt-3.5-turbo',
  modelList: [],
  mode: 'chat',
  continuous: true,
  temperature: 0.6,
  presence_penalty: 0,
  frequency_penalty: 0,
  size: '512x512',
  img_number: 1,
  web_access: false,
  show_token_cost: false,
  enableLangchain: false,
  langchainApi: '',
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
    key: 'modelType',
    label: 'config.modelChoose',
    type: 'select',
    options: modelList,
    renderLabel: modelSelectLabel,
  },
  {
    key: 'enableLangchain',
    label: 'config.enableLangchain',
    type: 'switch',
  },
  {
    key: 'langchainApi',
    label: 'config.langchainApi',
    type: 'input',
    ifShow: data => data.enableLangchain,
  },
  {
    label: 'config.sessionParameter',
    type: 'collapse',
    items: [
      {
        key: 'continuous',
        label: 'config.continuous',
        desc: 'config.continuous_desc',
        type: 'switch',
      },
      {
        key: 'web_access',
        label: 'config.webaccess.switch',
        type: 'switch',
      },
      {
        key: 'show_token_cost',
        label: 'config.showTokenCost',
        type: 'switch',
      },
      {
        key: 'temperature',
        label: 'config.temperature.title',
        desc: 'config.temperature.desc',
        type: 'slider',
        max: 1,
        min: 0,
        step: 0.1,
      },
      {
        key: 'presence_penalty',
        label: 'config.presence_penalty.title',
        desc: 'config.presence_penalty.desc',
        type: 'slider',
        max: 2,
        min: -2,
        step: 0.1,
      },
      {
        key: 'frequency_penalty',
        label: 'config.frequency_penalty.title',
        desc: 'config.frequency_penalty.desc',
        type: 'slider',
        max: 2,
        min: -2,
        step: 0.1,
      },
    ],
  },
  {
    label: 'config.imageParameter',
    type: 'collapse',
    items: [
      {
        key: 'size',
        label: 'config.size',
        type: 'select',
        options: [
          {
            label: '256x256',
            value: '256x256',
          },
          {
            label: '512x512',
            value: '512x512',
          },
          {
            label: '1024x1024',
            value: '1024x1024',
          },
        ],
      },
      {
        key: 'img_number',
        label: 'config.img_number.title',
        desc: 'config.img_number.desc',
        type: 'slider',
        max: 10,
        min: 1,
        step: 1,
      },
    ],
  },
]

export const iconName = 'tabler:brand-openai'
