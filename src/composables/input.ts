const inputRef = ref<HTMLTextAreaElement>()

export function initInputRef(el: HTMLTextAreaElement) {
  inputRef.value = el
}

export function getQueryInputVal() {
  return inputRef.value?.value
}

export function setQueryInputVal(val: string) {
  if (inputRef.value)
    inputRef.value.value = val
}
