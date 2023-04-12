import type { Flow } from '#/index'
import { useRecordStore } from '@/store'
import { computeTokens, generateId } from '@/utils'

export function buildFlowStruct({ ...flow }: Partial<Flow>) {
  return {
    ...flow,
    time: Date.now(),
    id: generateId(),
  }
}

// 接受到消息的处理
export function receiveMsg(text: string | void | null, done?: boolean, ext: Partial<Flow> = {}) {
  const recordStore = useRecordStore()
  const { setFlowBlock, pushBlock, assignFlowBlock, setFlowBlockByKey } = recordStore
  const { flowBlock } = storeToRefs(recordStore)

  if (text) {
    if (!flowBlock.value) {
      const block = buildFlowStruct({
        msg: text,
        type: curBotType.value,
        done: !!done,
        urls: ext.urls,
      })
      setFlowBlock(block)
      pushBlock(flowBlock.value!)
    }
    else if (!flowBlock.value.done) {
      assignFlowBlock({
        ...ext,
        msg: flowBlock.value.msg + text,
        done: !!done,
      })
    }
  }

  if (done) {
    const tokenCost = computeTokens(flowBlock.value?.msg || '')
    setFlowBlockByKey('tokenCost', tokenCost)
    setFlowBlockByKey('done', true)
    setFlowBlock(null)
  }
}

export function receiveImg(imgs: string[]) {
  const recordStore = useRecordStore()
  const { pushBlock } = recordStore
  const block = buildFlowStruct({
    imgs: toRaw(imgs),
  })

  pushBlock(block)
}
