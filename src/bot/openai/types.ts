import { Bot } from '#/index'

export namespace OpenAI {
  export const name = Bot.openai

  export enum Api {
    Balance = '/dashboard/billing/credit_grants',
    Completion = '/v1/completions',
    ChatCompletion = '/v1/chat/completions',
    Models = '/v1/models',
    Translation = '/v1/audio/transcriptions',
    CreateImage = '/v1/images/generations',
    EditImage = '/v1/images/edits',
    Subscriptions = '/v1/dashboard/billing/subscription',
    Usage = '/v1/dashboard/billing/usage',
    CreateChat = '/v1/chat/create',
    Plugins = '/v1/plugins',
    AddPlugin = '/v1/plugins/add',
  }

  export interface Config {
    baseURL: string
    // 模型类型
    modelType: string
    // 模型列表
    modelList: LabelValueOptions
    // 对话模式
    mode: 'chat' | 'img' | 'editImg'
    // 连续对话
    continuous: boolean
    temperature: number
    presence_penalty: number
    frequency_penalty: number

    size: string
    img_number: number
    // 是否联网
    web_access: boolean

    show_token_cost: boolean

    enableLangchain: boolean
    langchainApi: string
  }

  export interface Plugin {
    name: string
    description: string
    url: string
    icon?: string
    logo?: string
  }
}
