<script lang="ts" setup>
import InputBox from './InputBox.vue'
import FunctionArea from './FunctionArea.vue'
import { useRecordStore, useUIStore } from '@/store'
import { Bot, Role } from '#/index'
import { isBot } from '@/bot'

const funcArea = ref<typeof FunctionArea | null>(null)

const modeValue = ref('chat')
function changeMode(mode: string) {
  modeValue.value = mode
}
watch(curBotType, () => {
  modeValue.value = 'chat'
})

const { error } = useMessage()

const recordStore = useRecordStore()
const { prompt } = storeToRefs(recordStore)
const { pushBlock, setFlowBlock } = recordStore

const UIStore = useUIStore()
const { setGenerating, setShowTokenModal } = UIStore
const { isGenerating } = storeToRefs(UIStore)

// 是否能发送
function getApproval(input: string) {
  if (isGenerating.value)
    return

  // 检查是否设置了密钥
  if (!bot.value.apiKey.value) {
    error('请先设置密钥')
    setShowTokenModal(true)
    return
  }
  const mode = modeValue.value

  // bing的生成图片只支持英文字符
  if (isBot(bot.value, Bot.bing) && mode === 'img') {
    const reg = /^[a-zA-Z0-9\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*$/
    if (!reg.test(input)) {
      error('只支持英文字符')
      return false
    }
  }

  // 编辑图模式时检查是否上传了图片
  if (mode === 'editImg' && !funcArea.value?.imgInfo.img) {
    error('请先上传图片')
    return false
  }

  return true
}

function send() {
  const input = getQueryInputVal()
  if (!input)
    return

  if (!getApproval(input))
    return

  setGenerating(true)
  setQueryInputVal('')

  // 添加用户输入的消息
  const addusermsg = () => {
    let msg = input
    if (prompt.value)
      msg = prompt.value + msg

    pushBlock(
      buildFlowStruct({
        msg,
        type: Role.user,
      }),
    )
  }

  addusermsg()

  patchEvent(input)
}

async function patchEvent(input: string) {
  const end = (done: boolean) => {
    if (done) {
      setFlowBlock(null)
      setGenerating(false)
    }
  }
  switch (modeValue.value) {
    case 'chat':
      bot.value.chat?.(input, end)
      break

    case 'img':
      await bot.value.createImage?.(input)
      end(true)
      break
    case 'editImg': {
      const { img, mask } = funcArea.value?.imgInfo
      await bot.value.editImage?.(input, img.file, mask?.file)
      end(true)
      funcArea.value?.resetImg()
      break
    }
  }
}
</script>

<template>
  <NLayoutFooter shadow="[0px_-5px_5pxblack]" bg2 w-full h-135px pb-50px pt-15px>
    <div animate-bounce-in h-74px w-full flex justify-center>
      <div relative animate-head-shake w="80%">
        <InputBox :mode="modeValue" @send="send" />
        <FunctionArea ref="funcArea" :mode="modeValue" @change-mode="changeMode" @send="send" />
      </div>
    </div>
  </NLayoutFooter>
</template>
