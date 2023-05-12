import { BaseModel } from '../base'
import { OpenAI } from './types'
import { config, iconName, settingSchema } from './config'
import type { ReadTextStream } from './api'
import {
  addPlugin,
  chatCompletion,
  chatLangchain,
  completion,
  editImage,
  generateImage,
  getPlugins,
  getUsage,
  transcription,
} from './api'

import { Bot } from '#/index'
import { useGet } from '@/api'

class OpenAIModel extends BaseModel<OpenAI.Config, Bot.openai> {
  langchain_chat = false
  usePlugin = useStorage('plugins', {} as OpenAI.Plugin)

  constructor() {
    super(Bot.openai, iconName, config, settingSchema)
    if (!this.usePlugin.value?.name)
      this.usePlugin.value = null
  }

  chat(input: string, doneDeal: (d: boolean) => void) {
    const { modelType, enableLangchain, langchainApi } = this.config

    const callback: ReadTextStream = (txt, done) => {
      receiveMsg(txt, done)
      doneDeal(done)
    }

    if (modelType.startsWith('gpt-3.5') || modelType.startsWith('gpt-4')) {
      if (langchainApi && enableLangchain)
        this.langchianChat(input, doneDeal)
      else
        chatCompletion(this.config, callback, input)
    }
    else { completion(this.config, callback, input) }
  }

  langchianChat(input: string, doneDeal: (d: boolean) => void) {
    const { langchainApi } = this.config

    const plugin = this.usePlugin.value

    if (langchainApi) {
      // receiveMsg('', false, {
      //   plugin: {
      //     name: this.usePlugin.value.name,
      //     log: [],
      //   },
      // })

      chatLangchain(this.config, (val, done) => {
        console.log(val)
        receiveMsg(val.content, done, {
          plugin: {
            name: this.usePlugin.value.name,
            ...val.plugin,
          },
        })
        doneDeal(done)
      }, input, {
        plugin,
      })
    }
  }

  async createImage(input: string) {
    const { data } = await generateImage(this.config, input)
    if (!data.value)
      return
    const urls = unref(data)?.data.map((item: any) => item.url)

    receiveImg(urls)
  }

  async editImage(input: string, img: File, mask?: File) {
    const { data } = await editImage(this.config, {
      prompt: input,
      image: img,
      mask,
    })
    if (!data.value)
      return
    const urls = unref(data)?.data.map((item: any) => item.url)
    receiveImg(urls)
  }

  recorder(file: File) {
    return transcription(this.config, file)
  }

  async getBalance() {
    try {
      const { data: subsData } = await useGet(OpenAI.Api.Subscriptions)

      const total: number = subsData.value.hard_limit_usd

      const { data: usageData } = await getUsage()
      const used = usageData.value.total_usage / 100

      const available = total - used

      return {
        total: total.toFixed(2),
        used: used.toFixed(2),
        available: available.toFixed(2),
      }
    }
    catch (error) {
      return null
    }
  }

  async getPlugins() {
    try {
      const { data } = await getPlugins(this.config)
      return toRaw(data.value?.tools)
    }
    catch (error) {
      return null
    }
  }

  async loadPlugin(url: string) {
    try {
      return await addPlugin(this.config, url)
    }
    catch (error) {
    }
  }
}

export default new OpenAIModel()
