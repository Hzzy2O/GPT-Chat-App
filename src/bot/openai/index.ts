import { BaseModel } from '../base'
import type { OpenAI } from './types'
import { config, iconName, settingSchema } from './config'
import { chatCompletion, completion, generateImage, getBalnace, transcription } from './api'
import { Bot } from '#/index'

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

  // TODO
  // editImage(): void {}
  editImage = undefined

  recorder(file: File) {
    return transcription(this.config, file)
  }

  async getBalance() {
    const { data } = await getBalnace()

    const { total_granted, total_used, total_available } = data.value
    return {
      total: total_granted,
      used: total_used,
      available: total_available,
    }
  }
}
