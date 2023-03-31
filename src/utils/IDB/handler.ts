import { debounce } from 'lodash-es'
import { useRecordStoreWithOut } from '@/store'

// 注册history记录的操作
export async function registerHLDB() {
  const recordStore = useRecordStoreWithOut()
  const { setFlowList, setSessionId } = recordStore

  const watchCB = debounce(async () => {
    // 当前的会话记录id
    const id = recordStore.sessionId!

    const db = bot.value.history
    if (!db)
      return

    // 获取当前会话记录
    const record = await db.getItem(id)
    // 获取记录原始数据
    const flow = toRaw(recordStore.flowList)
    if (!flow.length)
      return

    if (record == null) {
      // 如果没有记录，就创建一条记录
      await db.addItem({
        flow,
        title: flow[0].msg || '',
        id,
      })
    }
    else {
      await db.updateItem(id, {
        flow,
      })
    }
  }, 500)

  // 监听flowList的变化
  watch(() => recordStore.flowList, watchCB, { deep: true })

  watch(
    () => curBotType.value,
    () => {
      bot.value.history?.refresh()
      setFlowList([])
      setSessionId(null)
    },
    { immediate: true },
  )
}
