import type { StorageLike } from '@vueuse/core'
import { decrypt, encrypt } from '../cipher'

export interface CreateStorageParams {
  prefixKey: string
  storage: Storage
  hasEncrypt: boolean
}

export default function<T extends Record<string, any>>({
  prefixKey = '',
  storage = localStorage,
  hasEncrypt = false,
}: Partial<CreateStorageParams> = {}) {
  const WebStorage = class WebStorage implements StorageLike {
    private storage: Storage
    private prefixKey?: string
    private hasEncrypt: boolean

    constructor() {
      this.storage = storage
      this.prefixKey = prefixKey
      this.hasEncrypt = hasEncrypt
    }

    private getKey(key: string) {
      return `${this.prefixKey}${key}`.toUpperCase()
    }

    setItem<K extends keyof T>(key: K, value: T[K]) {
      const stringData = JSON.stringify({
        value,
      })
      const stringifyValue = this.hasEncrypt ? encrypt(stringData) : stringData
      this.storage.setItem(this.getKey(key as string), stringifyValue)
    }

    getItem<K extends keyof T>(key: K, def: any = null): any {
      const val = this.storage.getItem(this.getKey(key as string))
      if (!val)
        return def

      try {
        const decVal = this.hasEncrypt ? decrypt(val) : val
        const data = JSON.parse(decVal)
        const { value } = data
        return value
      }
      catch (e) {
        return def
      }
    }

    removeItem(key: keyof T) {
      this.storage.removeItem(this.getKey(key as string))
    }

    clear(): void {
      this.storage.clear()
    }
  }
  return new WebStorage()
}
