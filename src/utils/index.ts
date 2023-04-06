import type { ElementOf } from '@vueuse/core'
import GPT3Tokenizer from 'gpt3-tokenizer'

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

export function computeTokens(txt: string) {
  const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })

  return tokenizer.encode(txt).bpe.length
}

// export function objToOptions(
//   obj: Record<string, string>,
//   label: string,
//   value: string,
// ): LabelValueOptions {
//   return Object.keys(obj).map((key) => ({ label, value }));
// }
