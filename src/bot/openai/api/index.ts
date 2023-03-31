import { OpenAI } from '../types'
import { parsePayload, streamParser } from './helper'
import { usePost } from '@/api/http'
import { useGet } from '@/api'

type ReadTextStream = (text: string, done: boolean) => void

export const getBalnace = () =>
  useGet(OpenAI.Api.Balance)

export const chatCompletion = (
  config: OpenAI.Config,
  readStream: ReadTextStream,
  input: string,
) =>
  usePost(OpenAI.Api.ChatCompletion, {
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
