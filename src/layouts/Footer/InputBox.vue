<script lang="ts" setup>
import { useUIStore } from '@/store'

defineProps<{
  mode: string
}>()

const emit = defineEmits(['send'])

// ui状态控制
const UIStore = useUIStore()
const { isGenerating } = storeToRefs(UIStore)

function catchEnter(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    emit('send')
    e.preventDefault()
  }
}

const { textarea, input } = useTextareaAutosize()

onMounted(() => {
  initInputRef(input)
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
    <textarea
      ref="textarea"
      v-model="input"
      w-full
      caret="[var(--theme-color)]"
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
