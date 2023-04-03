<script lang="ts" setup>
import Recorder from './FunctionalParts/Recorder.vue'
import Prompt from './FunctionalParts/Prompt.vue'

const emit = defineEmits(['setInput', 'send'])

function setInput(text: string) {
  emit('setInput', text)
}

// 录音功能
const hasRecorder = computed(() => !!bot.value.recorder)
const showRecorder = ref(false)
const containerCls = computed(() => (showRecorder.value ? 'h-full recorder_area pt-42px' : ''))
const toggleshowRecorder = useToggle(showRecorder)

// prompt Modal
const promptRef = ref<typeof Prompt | null>(null)
function openPrompt() {
  promptRef.value?.open()
}

// 模式选择
const options = computed(() =>
  [
    {
      label: t('footer.mode.chat'),
      value: 'chat',
      match: 'chat',
    },
    {
      label: t('footer.mode.img'),
      value: 'img',
      match: 'createImage',
    },
    {
      label: t('footer.mode.editImg'),
      value: 'editImg',
      match: 'editImage',
    },
  ].filter(item => !!bot.value[item.match]),
)
const modeVal = ref('chat')

watch(curBotType, () => {
  modeVal.value = 'chat'
})

defineExpose({
  mode: modeVal,
})
</script>

<template>
  <div
    ref="container"
    fic
    justify-between
    absolute
    w-full
    bottom-0
    pr-10px
    :class="`functional_area ${containerCls}`"
  >
    <div fc h-full>
      <div f-icon pl-0 relative>
        <Icon
          :title="t('footer.prompt.title')"
          name="tabler:prompt"
          :size="22"
          @click="openPrompt"
        />
      </div>
      <div v-if="hasRecorder" f-icon pl-0>
        <Icon
          :title="t('common.speechToTxt')"
          name="ic:round-keyboard-voice"
          :size="22"
          @click="toggleshowRecorder(true)"
        />
      </div>
      <div v-if="modeVal === 'editImg'" f-icon pl-0>
        <Icon name="uil:image-plus" :size="22" />
      </div>
    </div>
    <div fc>
      <template v-if="options.length">
        <n-popselect v-model:value="modeVal" :options="options" trigger="click">
          <div f-icon p-0 fc>
            <span cursor-pointer>{{ t(`footer.mode.${modeVal}`) }}</span>
          </div>
        </n-popselect>
        <NDivider vertical class="!mr-0" />
      </template>
      <div f-icon p-0>
        <Icon :title="t('common.send')" :size="22" name="line-md:telegram" @click="emit('send')" />
      </div>
    </div>
    <Transition>
      <Recorder
        v-if="showRecorder"
        class="recorder"
        @set-input="setInput"
        @close="toggleshowRecorder(false)"
      />
    </Transition>
    <Prompt ref="promptRef" />
  </div>
</template>

<style lang="scss" scoped>
  .functional_area {
    > [fc] {
      --at-apply: transition-opacity-1000;
    }

    &.recorder_area {
      .recorder {
        --at-apply: top-0;
      }
      > [fc] {
        opacity: 0;
      }
    }
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>
