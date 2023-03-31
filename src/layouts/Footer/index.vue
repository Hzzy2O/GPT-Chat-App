<script lang="ts" setup>
import InputBox from './InputBox.vue'
import FunctionArea from './FunctionArea.vue'
import { useRecordStore, useUIStore } from '@/store'

const inputRef = ref<typeof InputBox | null>(null)
const funcArea = ref<typeof FunctionArea | null>(null)

const { setFlowBlock } = useRecordStore()
const { setGenerating } = useUIStore()

function setInput(text: string) {
  inputRef.value?.setVal(text)
}

function send() {
  inputRef.value?.sendMsg()
}

async function patchEvent() {
  const input = inputRef.value?.input

  const end = (done: boolean) => {
    if (done) {
      setInput('')
      setFlowBlock(null)
      setGenerating(false)
    }
  }
  switch (funcArea.value?.mode) {
    case 'chat':
      bot.value.chat(input, end)
      break

    case 'img':
      await bot.value.createImage(input)
      end(true)
      break
      // bot.value.create;
  }
}
</script>

<template>
  <NLayoutFooter shadow="[0px_-5px_5pxblack]" bg1 w-full h-165px pb-50px pt-25px>
    <div animate-bounce-in h-80px w-full flex justify-center>
      <div relative animate-head-shake w="80%">
        <InputBox ref="inputRef" @send="patchEvent" />
        <FunctionArea ref="funcArea" @send="send" @set-input="setInput" />
      </div>
    </div>
  </NLayoutFooter>
</template>
