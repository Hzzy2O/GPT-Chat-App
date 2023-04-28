import { defineStore } from 'pinia'
import type { AutoGPT } from '@/bot/autogpt/types'
import { getAll } from '@/bot/autogpt/api'

interface AutoGPTState {
  running: boolean
  messageList: string[]
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
    addMessage(message: string) {
      this.messageList.push(message)
    },
    clearMessage() {
      this.messageList = []
    },
    setMessages(messageList: string[]) {
      this.messageList = messageList
    },
    setBotList(botList: AutoGPT.GPTInfo []) {
      this.botList = botList
    },
    fetchBotList() {
      getAll().then((res) => {
        this.setBotList(res.data.value!.list)
      })
    },
    setCurBotId(id: string) {
      this.curBotId = id
    },

  },
  getters: {
    getCurrentBot: state => state.botList.find(bot => bot.id === state.curBotId),
  },
})

export function useAutoGPTStoreWithOut() {
  return useAutoGPTStore(store)
}
