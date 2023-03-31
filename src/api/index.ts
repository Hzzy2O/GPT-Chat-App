import type { FetchConfig } from './http'
import { Method, warp } from './http'

export function useGet<T = any>(url: string, config: FetchConfig = {} as FetchConfig) {
  return warp<T>(Method.GET, url, config)
}

export function usePost<T = any>(url: string, config: FetchConfig = {} as FetchConfig) {
  return warp<T>(Method.POST, url, config)
}
