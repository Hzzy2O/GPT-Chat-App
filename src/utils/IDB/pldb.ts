import BaseDB from './base'
import { Names } from './types'

const pmpt
  = 'https://gist.githubusercontent.com/0xoopi/c3660663e6a641e67f89303b267f6d40/raw/91516ebe8a849b635ffd51cbff146390dd7c5c5e/pmpt.json'
type PLDB = Names.promptList
class PromptListDB extends BaseDB<PLDB> {
  constructor() {
    super(Names.promptList)
  }

  async getAll() {
    const list = await this.query()

    if (!list?.length) {
      const { data } = await useFetch(pmpt).json()
      data.value?.forEach((item: any) => {
        this.add(item)
      })

      return await this.query()
    }

    return list
  }

  async deleteById(id: string) {
    await this.delete(id)
  }
}

export const pldb = new PromptListDB()
