import type { Ref } from 'vue'

let inputRef: Ref<string>

export function initInputRef(el: Ref<string>) {
  inputRef = el
}

export function getQueryInputVal() {
  return inputRef.value
}

export function setQueryInputVal(val: string) {
  if (inputRef)
    inputRef.value = val
}
