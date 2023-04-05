<script lang="ts" setup>
import { Role } from '#/index'
import { buildFlowStruct } from '@/composables'
import { useRecordStore, useUIStore } from '@/store'

const props = defineProps<{
  mode: string
}>()

// function clearInput() {
//   input.value = '';
//   nextTick(() => {
//     triggerResize();
//   });
// }
const emit = defineEmits(['send'])
const { error } = useMessage()
const { textarea, input } = useTextareaAutosize()
function setVal(val: string) {
  input.value = val
}

// ui状态控制
const UIStore = useUIStore()
const { setGenerating, setShowTokenModal } = UIStore
const { isGenerating } = storeToRefs(UIStore)

// 聊天记录数据处理
const recordStore = useRecordStore()
const { prompt } = storeToRefs(recordStore)
const { pushBlock, setFlowBlock } = recordStore

const sendMsg = () => {
  if (!bot.value.apiKey.value) {
    error('请先设置密钥')
    setShowTokenModal(true)
    return
  }

  if (isBing(bot) && props.mode === 'img') {
    const reg = /^[a-zA-Z0-9\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*$/
    if (!reg.test(input.value)) {
      error('只支持英文字符')
      return
    }
  }

  // 判断是否有输入内容和是否正在生成回复
  if (!input.value || isGenerating.value)
    return

  setGenerating(true)

  // 添加用户输入的消息
  const addusermsg = () => {
    let msg = input.value
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

  // 定义监听完成的回调函数
  const doneDeal = (done: boolean) => {
    if (done) {
      input.value = ''
      setFlowBlock(null)
      setGenerating(false)
    }
  }

  emit('send', doneDeal)

  // bot.value.chat(input.value, doneDeal);
}

function catchEnter(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    sendMsg()
    e.preventDefault()
  }
}

defineExpose({
  setVal,
  sendMsg,
  input,
})
</script>

<template>
  <div
    bg-white
    dark:bg="dark-3"
    transition-all
    w-full
    p="l-14px t-12px b-38px"
    lg:p="t-13px l-14px"
    rd-12px
    shadow="[0_0_10px_rgba(0,0,0,0.10)]"
    dark:shadow="[0_0_15px_rgba(0,0,0,0.10)]"
    absolute
    top-auto
    bottom-0
    overflow-hidden
  >
    <div
      v-if="isGenerating"
      bg-white
      rd-12px
      dark:bg="dark-3"
      absolute
      bg1
      w-full
      h-full
      left-0
      top-0
      z-99
      fc
    >
      <span>{{ t('footer.wait') }}</span>
      <Icon ml-10px name="svg-spinners:blocks-wave" :size="28" cursor-default title="" />
    </div>
    <div v-if="isGenerating" w-full h-24px />
    <textarea
      v-else
      ref="textarea"
      v-model="input"
      w-full
      resize-none
      border-0
      bg-transparent
      border-none
      h-20px
      max-h-200px
      rows="1"
      scrollbar="~ rounded"
      :placeholder="t('footer.placeholder')"
      @keydown.enter="catchEnter"
    />
  </div>
</template>
