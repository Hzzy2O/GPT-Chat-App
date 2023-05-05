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

  chat(msg: string, doneDeal: (d: boolean) => void): void {
    const { setGenerating } = useUIStoreWithOut()
    bingChat(this.config, msg, async (data) => {
      const { answer, urls, done, token, suggests, frame_url, img_prompt } = data

      if (done) {
        let imgs: string[] = []

        if (img_prompt)
          imgs = await this.createImage(img_prompt, false)

        setGenerating(false)
        receiveMsg(' ', done, { urls, token, suggests, frame_url, imgs })

        doneDeal(true)
      }
      else { receiveMsg(answer, done, { urls, token }) }
    })
  }

  async createImage(msg: string, push = true) {
    const { error } = useToast()

    const { data } = await createImage(msg)
    if (!data.value) {
      error('图片生成失败')
      return
    }
    const { code, message, data: res } = data.value
    if (code !== 200)
      return error(message)

    return push ? receiveImg(res.imgs) : toRaw(res.imgs)
  }

  editImage = undefined
  recorder = undefined
  getBalance = undefined
}

export default new BingModel()
