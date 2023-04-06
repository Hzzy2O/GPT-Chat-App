export enum Bot {
  bing = 'bing',
  openai = 'openai',
}
export enum Role {
  user = 'user',
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
}

export type Language = 'zh-CN' | 'en-US'
