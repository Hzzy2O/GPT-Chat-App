import { format, startOfMonth } from 'date-fns'
import { OpenAI } from '../types'
import { parsePayload, streamParser } from './helper'
import { setTokenCost } from './payload'
import { searchWeb } from './boost'
import { useGet, usePost } from '@/api'

export type ReadTextStream = (text: string, done: boolean) => void

export const getUsage = () => useGet(OpenAI.Api.Usage, {
  params: {
    start_date: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end_date: format(Date.now() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),
  },
})

export const chatCompletion = async (
  config: OpenAI.Config,
  readStream: ReadTextStream,
  input: string,
) => {
  if (config.web_access)
    input = await searchWeb(input)

  setTokenCost(input)
  return usePost(OpenAI.Api.ChatCompletion, {
    params: parsePayload(OpenAI.Api.ChatCompletion, input, config),
    onStream: (data, control) => {
      try {
        const reader = (res: any, done: boolean) => {
          const text = res?.delta?.content
          readStream(text, done)
        }
        const parse = streamParser(reader, control)
        parse(data)
      }
      catch (err) {
        readStream('', true)
      }
    },
  })
}

export const chatLangchain = async (
  config: OpenAI.Config,
  readStream: ReadTextStream,
  input: string,
  ext: Recordable = {},
) => {
  setTokenCost(input)
  return usePost(OpenAI.Api.ChatCompletion, {
    params: Object.assign(parsePayload(OpenAI.Api.ChatCompletion, input, config), ext),
    onStream: (data, control) => {
      try {
        const reader = (res: any, done: boolean) => {
          readStream(res, done)
        }
        const parse = streamParser(reader, control)
        parse(data)
      }
      catch (err) {
        readStream('', true)
      }
    },
    baseURL: config.langchainApi,
  })
}

export const getPlugins = (config: OpenAI.Config) => useGet(OpenAI.Api.Plugins, {
  baseURL: config.enableLangchain ? config.langchainApi : undefined,
})

export const completion = (
  config: OpenAI.Config,
  readStream: ReadTextStream,
  input: string,
) =>
  usePost(OpenAI.Api.Completion, {
    params: parsePayload(OpenAI.Api.Completion, input, config),
    onStream: (data, control) => {
      const reader = (res: any, done: boolean) => {
        const text = res?.text
        readStream(text, done)
      }
      const parse = streamParser(reader, control)
      parse(data)
    },
  })

export const createChat = (config: OpenAI.Config, input: string) =>
  usePost(OpenAI.Api.CreateChat, {
    params: parsePayload(OpenAI.Api.CreateChat, input, config),
  })

// 音频转文字
export const transcription = (config: OpenAI.Config, input: File) =>
  usePost<{ text: string }>(OpenAI.Api.Translation, {
    params: parsePayload(OpenAI.Api.Translation, input, config),
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

export const generateImage = (config: OpenAI.Config, input: string) =>
  usePost(OpenAI.Api.CreateImage, {
    params: parsePayload(OpenAI.Api.CreateImage, input, config),
  })

export const editImage = (config: OpenAI.Config, params: Recordable) =>
  usePost(OpenAI.Api.EditImage, {
    params: parsePayload(OpenAI.Api.EditImage, params, config),
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
