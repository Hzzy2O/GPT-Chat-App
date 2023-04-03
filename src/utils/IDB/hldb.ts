import BaseDB from './base'
import type { HistoryBlock } from './types'
import { Names } from './types'
import type { Bot } from '#/index'
import { useRecordStoreWithOut } from '@/store'

export class HistoryListDB<T extends Bot> extends BaseDB<Names.historyList> {
  private _name: T

  constructor(name: T) {
    super(Names.historyList)
    this._name = name
    this.init()
  }

  async init() {
    const record = await this.query({ name: this._name })
    if (!record)
      this.add({ name: this._name, list: [] })
  }

  // 当前bot时， 同步store的historyList
  async refresh() {
    if (this._name === curBotType.value) {
      const recordStore = useRecordStoreWithOut()
      recordStore.setHistoryList(await this.getAll())
    }
  }

  async getAll() {
    const data = await this.query({ name: this._name })
    if (!data || !data.length)
      return []
    return data[0].list || []
  }

  async getItem(id: string) {
    const list = await this.getAll()
    return list?.find(item => item.id === id)
  }

  async addItem(item: HistoryBlock) {
    const list = await this.getAll()
    list?.unshift(item)
    this.update(this._name, { list })
    this.refresh()
  }

  async updateItem(id: string, item: Partial<HistoryBlock>) {
    const list = await this.getAll()
    const index = list?.findIndex(i => i.id === id)
    if (index >= 0) {
      list?.splice(index, 1, { ...list[index], ...item })
      await this.update(this._name, { list })
      await this.refresh()
    }
  }

  async delete(id: string) {
    const list = await this.getAll()
    const index = list?.findIndex(item => item.id === id)
    if (index >= 0) {
      list?.splice(index, 1)
      await this.update(this._name, { list })
      await this.refresh()
    }
  }

  async clearAll() {
    await this.update(this._name, {
      list: [],
    })
    await this.refresh()
  }
}
