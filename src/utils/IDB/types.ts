import type { Flow } from '#/index'

export enum Names {
  historyList = 'history-list',
  promptList = 'prompt-list',
}

export interface HistoryBlock {
  title: string
  flow: Flow[]
  id: string
}

export interface HistorySpace {
  name: string
  list: Array<HistoryBlock>
}

export interface PromptBlock {
  title: string
  content: string
  lang: 'en' | 'zh'
}
