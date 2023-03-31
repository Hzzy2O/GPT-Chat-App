import { BaseModel } from '../base'
import type { Bing } from './types'
import { config, iconName, settingSchema } from './config'
import { bingChat, createImage } from './api'
import { Bot } from '#/index'
import { useUIStoreWithOut } from '@/store'

class BingModel extends BaseModel<Bing.Config, Bot.bing> {
  constructor() {
    super(Bot.bing, iconName, config, settingSchema)
  }

  chat(msg: string): void {
    const { setGenerating } = useUIStoreWithOut()
    bingChat(this.config, msg, (data) => {
      const { answer, urls, done, token } = data

      setGenerating(false)
      if (done)
        receiveMsg(' ', done, { urls, token })
      else
        receiveMsg(answer, done, { urls, token })
    })
  }

  async createImage(msg: string) {
    const { error } = useToast()
    const reg = /^[a-zA-Z0-9\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*$/
    if (!reg.test(msg)) {
      error('只支持英文字符')
      return
    }
    const { data } = await createImage(msg)
    if (!data.value) {
      error('图片生成失败')
      return
    }
    const { code, message, data: res } = data.value
    if (code !== 200)
      return error(message)

    return receiveImg(res.imgs)
  }

  editImage = undefined
  recorder = undefined
  getBalance = undefined
}

export default BingModel
