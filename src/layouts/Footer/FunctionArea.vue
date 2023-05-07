<script lang="ts" setup>
import type { FileInfo } from 'naive-ui/es/upload/src/interface'
import Recorder from './FunctionalParts/Recorder.vue'
import Prompt from './FunctionalParts/Prompt.vue'
import ImgUploader from './FunctionalParts/ImgUploader.vue'
import PluginStore from './FunctionalParts/PluginStore.vue'
import { useRecordStore, useUIStore } from '@/store'

const props = defineProps<{
  mode: string
}>()
const emit = defineEmits(['send', 'changeMode'])

const UIStore = useUIStore()
const { setGenerating } = useUIStore()
const { isGenerating } = storeToRefs(UIStore)
const RecordStore = useRecordStore()
const { flowBlock } = storeToRefs(RecordStore)
const { runAbortRef, setFlowBlockByKey, setFlowBlock } = RecordStore

function stopGenerate() {
  runAbortRef()
  setGenerating(false)
  if (flowBlock.value) {
    setFlowBlockByKey('done', true)
    setFlowBlock(null)
  }
}

function setInput(text: string) {
  setQueryInputVal(text)
}

function changeMode(mode: string) {
  emit('changeMode', mode)
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

// 图片信息
const imgInfo = reactive({
  img: undefined as FileInfo | undefined,
  mask: undefined as FileInfo | undefined,
})
function setImgInfo(img: FileInfo | undefined, mask: FileInfo | undefined) {
  imgInfo.img = img
  imgInfo.mask = mask
}

// 图片弹窗
const imgUploader = ref<typeof ImgUploader | null>(null)
function openImgUploader() {
  imgUploader.value?.openModal()
}

// 图片弹窗
const pluginModal = ref<typeof PluginStore | null>(null)
function openPluginModal() {
  pluginModal.value?.openModal()
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

defineExpose({
  imgInfo,
  resetImg: () => setImgInfo(undefined, undefined),
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
      <!-- <div f-icon> -->
      <!--   <Icon -->
      <!--     :title="t('common.speechToTxt')" -->
      <!--     name="raphael:plugin" -->
      <!--     :size="22" -->
      <!--     @click="openPluginModal" -->
      <!--   /> -->
      <!-- </div> -->
      <div v-if="props.mode === 'editImg'" relative f-icon pl-0>
        <Icon name="uil:image-plus" :size="22" @click="openImgUploader" />
      </div>
    </div>
    <div fc>
      <template v-if="options.length">
        <NPopselect :value="props.mode" :options="options" trigger="click" @update-value="changeMode">
          <div f-icon p-0 fc>
            <span cursor-pointer>{{ t(`footer.mode.${props.mode}`) }}</span>
          </div>
        </NPopselect>
        <NDivider vertical class="!mr-0" />
      </template>
      <div f-icon p-0>
        <Icon v-if="isGenerating" :title="t('main.chat.stop_generate')" :size="22" name="material-symbols:stop-circle-outline-rounded" @click="stopGenerate" />
        <Icon v-else :title="t('common.send')" :size="22" name="line-md:telegram" @click="emit('send')" />
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
    <ImgUploader ref="imgUploader" :img-info="imgInfo" @set-img-info="setImgInfo" />
    <PluginStore ref="pluginModal" />
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
