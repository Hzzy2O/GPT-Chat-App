import { BaseModel } from '../base'
import type { AutoGPT } from './types'
import { config, iconName, settingSchema } from './config'
import { } from './api'
import { Bot } from '#/index'

class AutoGPTModel extends BaseModel<AutoGPT.Config, Bot.autogpt> {
  constructor() {
    super(Bot.autogpt, iconName, config, settingSchema)
  }

  chat = undefined
  createImage = undefined
  editImage = undefined
  recorder = undefined
  getBalance = undefined
}

export default new AutoGPTModel()
