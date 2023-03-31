import type { ElementOf } from '@vueuse/core'

// 生成唯一id
export function generateId() {
  const timestamp = Date.now()

  const randomNum = Math.floor(Math.random() * 1000)

  const id = timestamp.toString() + randomNum.toString()
  return id
}

export function enumToOptions(
  em: Record<string, string>,
  cb?: (item: [string, string]) => ElementOf<LabelValueOptions>,
): LabelValueOptions {
  const _cb = cb || (([label, value]) => ({ label, value }))
  return Object.entries(em).map(_cb)
}

// export function objToOptions(
//   obj: Record<string, string>,
//   label: string,
//   value: string,
// ): LabelValueOptions {
//   return Object.keys(obj).map((key) => ({ label, value }));
// }
