import { BaseModel } from '../base'
import type { AutoGPT } from './types'
import { config, iconName, settingSchema } from './config'
import { getAll, runTask } from './api'
import { Bot } from '#/index'
import { useAutoGPTStoreWithOut } from '@/store'

export class AutoGPTModel extends BaseModel<AutoGPT.Config, Bot.autogpt> {
  constructor() {
    super(Bot.autogpt, iconName, config, settingSchema)
  }

  chat = undefined
  createImage = undefined
  editImage = undefined
  recorder = undefined
  getBalance = undefined

  async getAllBot() {
    const { setBotList } = useAutoGPTStoreWithOut()
    const { data } = await getAll()
    setBotList(data.value!.list)
  }

  setRunBot(id: string) {
    const { setCurBotId, running, curBotId, botList, messageList, setMessages } = useAutoGPTStoreWithOut()
    if (id === curBotId)
      return

    if (running)
      return useToast().error(t('autogpt.running_err'))

    setCurBotId(id)
    const bot = botList.find(bot => bot.id === id)
    setMessages(bot?.messages || [])
    if (this.config.autorun)
      this.startRun()
  }

  resetBot() {
    const { setRunning, setCurBotId } = useAutoGPTStoreWithOut()
    setRunning(false)
    setCurBotId('')
  }

  stopRun() {
    const { setRunning } = useAutoGPTStoreWithOut()
    setRunning(false)
  }

  async startRun() {
    const autogptStore = useAutoGPTStoreWithOut()
    const { setRunning, addMessage } = autogptStore
    const { running, curBotId } = storeToRefs(autogptStore)
    setRunning(true)
    let runFlag = true

    while (runFlag) {
      const { data, error } = await runTask({ gpt_id: curBotId.value })
      if (error.value) {
        useToast().error(error.value!)
        setRunning(false)
        return
      }
      console.log(data.value)
      if (data.value)
        addMessage(data.value)

      runFlag = running.value && this.config.autorun
    }
    setRunning(false)
  }
}

export default new AutoGPTModel()
