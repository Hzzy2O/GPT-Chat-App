<script lang="ts" setup>
defineProps<{
  mode: string
}>()

const emit = defineEmits(['send'])

// ui状态控制
function catchEnter(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    emit('send')
    e.preventDefault()
  }
}

const { textarea, input } = useTextareaAutosize()

watch(input, (val) => {
  if (textarea.value && val !== textarea.value.value)
    textarea.value.value = val
})

onMounted(() => {
  initInputRef(input)
})
</script>

<template>
  <div
    bg-white
    transition-all
    w-full
    rd-12px
    top-auto
    bottom-0
    overflow-hidden
    class="textareaBox"
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

<style lang="scss">
.textareaBox {
  --at-apply: absolute dark:bg-dark-3 lg:pt-13px lg:pl-14px dark:shadow-[0_0_15px_rgba(0,0,0,0.10)];
  padding: 12px 14px 38px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
