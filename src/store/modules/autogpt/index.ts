import { defineStore } from 'pinia'
import type { AutoGPT } from '@/bot/autogpt/types'
import { getAll } from '@/bot/autogpt/api'

interface AutoGPTState {
  running: boolean
  messageList: AutoGPT.GPTAction[]
  botList: AutoGPT.GPTInfo []
  curBotId: string
}

export const useAutoGPTStore = defineStore('autogpt-store', {
  state: (): AutoGPTState => ({
    running: false,
    messageList: [],
    botList: [],
    curBotId: '',
  }),
  actions: {
    setRunning(running: boolean) {
      this.running = running
    },
    addMessage(message: AutoGPT.GPTAction) {
      this.messageList.push(message)
    },
    clearMessage() {
      this.messageList = []
    },
    setMessages(messageList: AutoGPT.GPTAction[]) {
      this.messageList = messageList
    },
    setBotList(botList: AutoGPT.GPTInfo []) {
      this.botList = botList
    },
    fetchBotList() {
      getAll().then((res) => {
        if (res.data.value)
          this.setBotList(res.data.value!.list)
      })
    },
    setCurBotId(id: string) {
      this.curBotId = id
    },
    setBotById(id: string, value: Partial<AutoGPT.GPTInfo>) {
      const bot = this.botList.find(bot => bot.id === id) as AutoGPT.GPTInfo
      Object.assign(bot, value)
    },

  },
  getters: {
    getCurrentBot: state => state.botList.find(bot => bot.id === state.curBotId),
  },
})

export function useAutoGPTStoreWithOut() {
  return useAutoGPTStore(store)
}
