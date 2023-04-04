import type { ParsedEvent, ReconnectInterval } from 'eventsource-parser'
import { createParser } from 'eventsource-parser'
import { isFunction } from 'lodash-es'
import { OpenAI } from '../types'
import { Role } from '#/index'
import { useRecordStoreWithOut } from '@/store'

type Input = Nullable<string | File>
export function parsePayload(type: OpenAI.Api, input: Input, config: OpenAI.Config) {
  switch (type) {
    case OpenAI.Api.Completion: {
      const basePayload = _completionPayload(config)

      return {
        ...basePayload,
        prompt: input,
      }
    }
    case OpenAI.Api.ChatCompletion: {
      const basePayload = _completionPayload(config)
      const { flowList } = useRecordStoreWithOut()
      let messages: any[]
      if (config.continuous) {
        messages = flowList
          .filter(i => i.msg)
          .map(item => ({
            role: item.type === Role.user ? 'user' : 'assistant',
            content: item.msg,
          }))
      }
      else {
        messages = [
          {
            role: 'user',
            content: input,
          },
        ]
      }

      return {
        ...basePayload,
        messages,
      }
    }
    case OpenAI.Api.Translation: {
      const language = locale.value === 'zh-CN' ? 'zh' : 'en'
      const basePayload = {
        model: 'whisper-1',
        response_format: 'json',
        temperature: 0.6,
        language,
      }
      const formData = new FormData()
      Object.keys(basePayload).forEach((key) => {
        formData.append(key, basePayload[key])
      })
      formData.append('file', input as File)

      return formData
    }

    case OpenAI.Api.CreateImage: {
      const { size, img_number } = config

      return {
        prompt: input,
        response_format: 'url',
        size,
        n: img_number,
      }
    }
    default:
      return {} as never
  }
}

function _completionPayload(config: OpenAI.Config) {
  const { modelType, temperature, presence_penalty, frequency_penalty } = config

  return {
    model: modelType,
    temperature,
    presence_penalty,
    frequency_penalty,
    stream: true,
  }
}

export function streamParser(
  callback: (str: string | null, bol: boolean) => void,
  controller: any,
) {
  const encoder = new TextEncoder()

  const streamParser = (event: ParsedEvent | ReconnectInterval) => {
    if (event.type === 'event') {
      const data = event.data
      if (data === '[DONE]') {
        if (isFunction(callback))
          callback(null, true)
        controller.close()
        return
      }
      try {
        const json = JSON.parse(data)
        const [content] = json.choices
        if (isFunction(callback))
          callback(content, false)

        const str = JSON.stringify(content)

        const queue = encoder.encode(str)
        controller.enqueue(queue)
      }
      catch (e) {
        controller.error(e)
      }
    }
  }
  const parser = createParser(streamParser)

  return parser.feed
}
