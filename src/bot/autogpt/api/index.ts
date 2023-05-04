import { AutoGPT } from '../types'
import { useGet, usePost } from '@/api'

export const getAll = () => useGet<{ list: AutoGPT.GPTInfo[] }>(AutoGPT.Api.GetAll)

interface CreateInput {
  ai_name: string
  ai_role: string
  ai_goals: string[]
}
export const create = (params: CreateInput) => usePost(AutoGPT.Api.Create, { params })

export const runTask = (params: { gpt_id: string }) => usePost(AutoGPT.Api.Run, { params })

export const downloadFile = (params: { gpt_id: string; path: string }) =>
  usePost(AutoGPT.Api.Download, {
    params,
    transformResponse(r) {
      return r.blob()
    },
  })

export const getFileInfo = (params: { gpt_id: string }) => usePost(AutoGPT.Api.FileInfo, { params })
