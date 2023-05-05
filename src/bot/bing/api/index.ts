import { last } from 'lodash-es'
import { Bing } from '../types'
import { usePost } from '@/api/http'
import { useRecordStoreWithOut, useUIStoreWithOut } from '@/store'
import type { Flow } from '#/index'

type ResData = {
  answer: string
  done: boolean
  token?: string
} & Pick<Flow, 'urls' | 'suggests' | 'frame_url' | 'img_prompt'>

export const bingChat = (config: Bing.Config, query: string, readStream: (o: ResData) => void) => {
  const recordStore = useRecordStoreWithOut()
  const { flowList } = recordStore
  const lastFlow = last(flowList.filter(item => item.type === 'bing'))
  const token = lastFlow?.token
  return usePost(Bing.Api.chat, {
    params: {
      style: config.promptStyle,
      question: query,
      token,
    },
    onStream: (stream) => {
      const UIStore = useUIStoreWithOut()
      const error = (message: string) => {
        UIStore.setGenerating(false)
        useToast().error(message)
      }
      try {
        const pattern = /{.*?}(?=({.*?})|$)/g
        const matches = stream.match(pattern)
        const reader = (str: string) => {
          const { code, data, message } = JSON.parse(str)
          if (code === 200)
            readStream(data)

          else
            error(message)
        }
        matches && Array.from(matches).forEach(reader)
      }
      catch (err: any) {
        error(err.message)
      }
    },
  })
}

export const createImage = (input: string) =>
  usePost(Bing.Api.createImage, {
    params: {
      prompt: input,
    },
  })
