import qs from 'qs'
import type { ReadStreamFunc } from './helper'
import { parseStream } from './helper'
import { useToast } from '@/composables'
import { useUIStoreWithOut } from '@/store'

export enum Method {
  GET = 'GET',
  POST = 'POST',
}

type Params = Record<string | number, any>
type TransformResponse<T = any> = (a: Response) => Promise<T>

export interface FetchConfig {
  headers?: HeadersInit
  params?: Params
  transformResponse?: TransformResponse
  onStream?: ReadStreamFunc
  json?: (a: Record<string, any>) => void
  baseURL?: string
}

export function warp<T>(method: Method, url: string, config: FetchConfig) {
  const {
    headers = {},
    onStream,
    transformResponse = _transformTxt,
    params,
    baseURL: _baseURL,
  } = config

  const { config: botConfig } = bot.value
  const { baseURL } = botConfig

  const token = bot.value.apiKey

  const isFormData = (obj: any): obj is FormData => obj instanceof FormData

  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...headers,
    },
    body:
      method === Method.POST ? (isFormData(params) ? params : JSON.stringify(params || {})) : undefined,
  }

  if (options.headers!['Content-Type'] === 'multipart/form-data')
    delete options.headers!['Content-Type']

  const parseUrl = (method: Method, url: string, query?: Record<string, any>) => {
    const base = _baseURL || baseURL

    if (method === Method.GET && query) {
      const queryStr = qs.stringify(query)
      url += `?${queryStr}`
    }
    return `${base}${url}`
  }
  const finalUrl = parseUrl(method, url, params)

  return _useFetch<T>(finalUrl, options, transformResponse, onStream)
}

async function _transformTxt(res: Response) {
  const text = await res.text()
  if (!text)
    return text

  try {
    return JSON.parse(text)
  }
  catch (error) {
    // error
  }
}

export function useGet<T = any>(url: string, config: FetchConfig = {} as FetchConfig) {
  return warp<T>(Method.GET, url, config)
}

export function usePost<T = any>(url: string, config: FetchConfig = {} as FetchConfig) {
  return warp<T>(Method.POST, url, config)
}

function _useFetch<T = any>(
  url: string,
  options: RequestInit,
  transformResponse: TransformResponse,
  onStream?: ReadStreamFunc,
) {
  const data = ref<T | null>(null)

  const isFetching = ref(false)
  const isFinished = ref(false)

  const statusCode = ref()
  const error = ref<string | null>(null)

  const controller = ref<AbortController | null>(null)

  const { setGenerating } = useUIStoreWithOut()

  // 用于终止请求
  function abort() {
    if (controller.value)
      controller.value.abort()
  }
  // 用于重新请求
  async function execute() {
    try {
      data.value = null
      error.value = null

      isFetching.value = true

      controller.value = new AbortController()

      const response = await fetch(url, { ...options, signal: controller.value.signal })

      statusCode.value = response.status

      if (response.ok) {
        if (onStream && response.body) {
          parseStream(response.body, onStream)
        }
        else {
          const res = await transformResponse(response)
          data.value = res
        }
      }
      else {
        throw new Error(response.statusText)
      }
    }
    catch (err: any) {
      setGenerating(false)
      if (err.name === 'AbortError') {
        // console.log('Request aborted')
      }
      else {
        error.value = err.message
        // assign the error to the error ref
        const toast = useToast()
        switch (statusCode.value) {
          case 401:
            toast.error(t('net.error.401'))
            break
          case 403:
            toast.error(t('net.error.403'))
            break
          case 404:
            toast.error(t('net.error.404'))
            break
          case 500:
            toast.error(t('net.error.500'))
            break
          default:
            toast.error(t('net.error.unknown') + err.message)
        }
      }
    }
    finally {
      // set the fetching status to false and clear the controller ref
      isFetching.value = false
      isFinished.value = true
      controller.value = null
    }
  }
  execute()

  const shell = {
    data,
    isFetching,
    error,
    abort,
    execute,
  }

  function waitUntilFinished() {
    return new Promise((resolve, reject) => {
      until(isFinished)
        .toBe(true)
        .then(() => resolve(shell))
        .catch(error => reject(error))
    })
  }

  return {
    ...shell,
    then(onFulfilled: (value: typeof shell) => void, onRejected?: (value: unknown) => void) {
      return waitUntilFinished().then(onFulfilled, onRejected)
    },
  }
}
