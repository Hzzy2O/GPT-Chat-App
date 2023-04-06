import { BaseModel } from '../base'
import { OpenAI } from './types'
import { config, iconName, settingSchema } from './config'
import { chatCompletion, completion, editImage, generateImage, getUsage, transcription } from './api'
import { Bot } from '#/index'
import { useGet } from '@/api'

export default class OpenAIModel extends BaseModel<OpenAI.Config, Bot.openai> {
  constructor() {
    super(Bot.openai, iconName, config, settingSchema)
  }

  chat(input: string, doneDeal: (d: boolean) => void) {
    const { modelType } = this.config

    const callback = (txt: string, done: boolean) => {
      receiveMsg(txt, done)
      doneDeal(done)
    }

    if (modelType.startsWith('gpt-3.5'))
      chatCompletion(this.config, callback, input)
    else
      completion(this.config, callback, input)
  }

  async createImage(input: string) {
    const { data } = await generateImage(this.config, input)
    if (!data.value)
      return
    const urls = unref(data)?.data.map((item: any) => item.url)

    receiveImg(urls)
  }

  async editImage(input, img, mask) {
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
}
