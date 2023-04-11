import type { Ref } from 'vue'

let inputRef: Ref<HTMLTextAreaElement>

export function initInputRef(el: Ref<HTMLTextAreaElement>) {
  inputRef = el
}

export function getQueryInputVal() {
  return inputRef.value?.value
}

export function setQueryInputVal(val: string) {
  if (inputRef.value)
    inputRef.value.value = val
}
