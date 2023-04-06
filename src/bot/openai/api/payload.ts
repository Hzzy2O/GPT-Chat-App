import { useRecordStoreWithOut } from '@/store'
import { computeTokens } from '@/utils'

export function setTokenCost(text: string, index?: number) {
  const recordStore = useRecordStoreWithOut()
  const { setFlowListItemByIndex, flowList } = recordStore

  const tokenCost = computeTokens(text)

  setFlowListItemByIndex(index || flowList.length - 1, {
    tokenCost,
  })
}
