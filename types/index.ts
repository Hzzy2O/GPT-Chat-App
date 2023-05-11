export enum Bot {
  bing = 'bing',
  openai = 'openai',
  autogpt = 'autogpt',
}
export enum Role {
  user = 'user',
}

interface Plugin {
  name?: string
  log?: string[]
}

export interface Flow {
  id: string
  time: number
  msg?: string
  type?: Role | Bot
  done?: boolean
  urls?: Array<{
    title: string
    url: string
  }>
  imgs?: Array<string>
  // BING连续对话用
  token?: string
  // 花费的token数量
  tokenCost?: number
  suggests?: string[]
  frame_url?: string
  img_prompt?: string
  plugin?: Plugin
}

export type Language = 'zh-CN' | 'en-US'
