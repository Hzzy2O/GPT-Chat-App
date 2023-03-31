import type { DBSchema, IDBPDatabase, StoreNames, StoreValue } from 'idb'
import { openDB } from 'idb'
import type { HistorySpace, PromptBlock } from './types'
import { Names } from './types'

interface SchemaVal<T, I = { id: string }> {
  key: string
  value: T
  indexes: I
}

interface IdbSchema extends DBSchema {
  [Names.historyList]: SchemaVal<HistorySpace, { name: string }>
  [Names.promptList]: SchemaVal<PromptBlock, { title: string }>
}

// // 定义基础类
class BaseDB<T extends StoreNames<IdbSchema>> {
  dbPromise: Promise<IDBPDatabase<IdbSchema>>
  storeName: T

  constructor(storeName: T) {
    this.dbPromise = openDB<IdbSchema>('chat-idb', 1, {
      upgrade(db) {
        db.createObjectStore(Names.historyList, { keyPath: 'name' })
        db.createObjectStore(Names.promptList, { keyPath: 'title' })
      },
    })
    this.storeName = storeName
  }

  async add(item: StoreValue<IdbSchema, T>) {
    try {
      // 获取数据库对象
      const db = await this.dbPromise
      // 获取事务对象
      const tx = db.transaction(this.storeName, 'readwrite')
      // 获取store对象
      const store = tx.objectStore(this.storeName)
      // 添加记录到store中
      await store.add(item)
      // 等待事务完成
      await tx.done
    }
    catch (err) {
      // throw new Error(err)
    }
  }

  // 删除一条记录，根据id参数
  async delete(id: string) {
    const db = await this.dbPromise
    const tx = db.transaction(this.storeName, 'readwrite')
    const store = tx.objectStore(this.storeName)
    store.delete(id)
    await tx.done
  }

  // 修改操作
  async update(id: string, newData: Partial<StoreValue<IdbSchema, T>>) {
    const db = await this.dbPromise
    const tx = db.transaction(this.storeName, 'readwrite')
    const store = tx.objectStore(this.storeName)

    try {
      const item = await store.get(id)
      if (!item)
        return

      await store.put({
        ...item,
        ...newData,
      })
      await tx.done
    }
    catch (e) {
      // throw new Error(e)
    }
  }
  // 查询操作

  // 查询一条或多条记录，根据可选的过滤条件参数（如title或flowlist）
  async query(filter?: Partial<StoreValue<IdbSchema, T>>) {
    const db = await this.dbPromise
    const tx = db.transaction(this.storeName, 'readonly')
    const store = tx.objectStore(this.storeName)

    // 如果没有过滤条件，返回所有记录的数组
    if (!filter)
      return store.getAll()

    // 否则，创建一个空数组用于存储匹配的记录
    const result: StoreValue<IdbSchema, T>[] = []

    let cursor = await store.openCursor()

    while (cursor) {
      const value = cursor.value

      // 检查该值是否满足过滤条件中的每个属性（key）和值（value）
      let match = true

      for (const key in filter) {
        if (value[key] !== filter[key]) {
          match = false
          break
        }
      }

      // 如果匹配，将该值添加到结果数组中
      if (match)
        result.push(value)

      // cursor.advance(1);
      // 移动游标到下一个位置
      cursor = await cursor.continue()
    }

    return result.length ? result : null
  }

  // 清空store
  async clear() {
    const db = await this.dbPromise
    const tx = db.transaction(this.storeName, 'readwrite')
    const store = tx.objectStore(this.storeName)
    store.clear()
    await tx.done
  }
}

export default BaseDB
