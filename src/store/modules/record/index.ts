import { defineStore } from 'pinia'

import type { HistoryBlock } from '@/utils/IDB/types'
import type { Flow } from '#/.'
import { generateId } from '@/utils'

type HistoryList = HistoryBlock[]
interface RecordState {
  flowList: Array<Flow>
  flowBlock: Nullable<Flow>
  sessionId: Nullable<string>
  historyList: HistoryList
  prompt: string
  abortRef: AbortController | null
}

export const useRecordStore = defineStore('record-store', {
  state: (): RecordState => ({
    flowList: [],
    flowBlock: null,
    sessionId: null,
    historyList: [],
    prompt: '',
    abortRef: null,
  }),
  actions: {
    setAbortRef(ref: AbortController | null) {
      this.abortRef = ref
    },
    runAbortRef() {
      if (this.abortRef) {
        this.abortRef.abort()
        this.abortRef = null
      }
    },
    setPrompt(prompt: string) {
      this.prompt = prompt
    },
    setFlowBlock(block: RecordState['flowBlock']) {
      this.flowBlock = block
    },
    assignFlowBlock(block: Partial<RecordState['flowBlock']>) {
      if (this.flowBlock)
        Object.assign(this.flowBlock, block)
    },
    setFlowBlockByKey<K extends keyof Flow>(key: K, val: Flow[K]) {
      if (this.flowBlock)
        this.flowBlock[key] = val
    },
    pushBlock(block: Flow) {
      if (!this.sessionId)
        this.setSessionId(generateId())

      this.flowList.push(block)
    },
    setFlowList(list: Flow[]) {
      this.flowList = list
    },
    setFlowListItemByIndex(index: number, block: Partial<Flow>) {
      this.flowList.splice(index, 1, {
        ...this.flowList[index],
        ...block,
      })
    },
    setSessionId(id: string | null) {
      this.sessionId = id
    },
    setHistoryList(list: HistoryList) {
      this.historyList = list
    },
  },
})

export function useRecordStoreWithOut() {
  return useRecordStore(store)
}
