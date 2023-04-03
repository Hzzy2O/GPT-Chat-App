// 亮暗主题
export const isDark = useDark()
export const toggleDark = useToggle(isDark)

// 注册全局toast提示api
const msgRef = ref<Nullable<ReturnType<typeof useMessage>>>(null)
export function registerMessageApi() {
  msgRef.value = useMessage()
}
export function useToast() {
  const msg = msgRef.value
  if (!msg)
    throw new Error('You must call register() before useToast()')

  return msg
}

export function isDev() {
  return import.meta.env?.DEV
}

export * from './handler'
