<script lang="ts" setup>
import { debounce } from 'lodash-es'

const emit = defineEmits(['close', 'setInput'])

const { error } = useMessage()

// 是否正在录音
const isRecording = ref(false)
const toggleIsrecording = useToggle(isRecording)

const loading = ref(false)

// 播放和停止的图标
const icon = computed(() =>
  loading.value
    ? 'svg-spinners:6-dots-rotate'
    : isRecording.value
      ? 'line-md:play-filled-to-pause-transition'
      : 'line-md:pause-to-play-filled-transition',
)

const recorder = ref<Nullable<MediaRecorder>>(null)
const chunks = ref<Blob[]>([])

async function handleButton() {
  if (loading.value)
    return
  if (isRecording.value) {
    stopRecording()
  }
  else {
    if (!navigator.mediaDevices) {
      error(t('footer.recorder.noSupport'))
      stopRecording()
      emit('close')
      return
    }
    startRecording()
  }
}

const watchRecording = debounce(() => {
  if (!isRecording.value)
    stopRecording()
}, 500)

watch(isRecording, watchRecording, { immediate: false })

// 开始录音
async function startRecording() {
  try {
    // 获取音频流
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    // 创建 MediaRecorder 实例，并配置相关参数
    recorder.value = new MediaRecorder(stream)

    isRecording.value = true

    // 监听 start 事件，清空录音数据
    const start_rm = useEventListener(recorder.value, 'start', () => {
      chunks.value = []
    })

    // 监听 dataavailable 事件，将录音数据保存到 chunks 数组中
    const vaild_rm = useEventListener(
      recorder.value,
      'dataavailable',
      (event) => {
        chunks.value.push((event as any).data)
      },
    )

    // 监听 stop 事件，处理录音数据
    const stop_rm = useEventListener(recorder.value, 'stop', () => {
      // 将录音数据合并为一个 Blob 对象
      const blob = new Blob(chunks.value, { type: 'audio/wav' })

      const file = new File([blob], 'recording.wav', {
        type: 'audio/wav',
        lastModified: Date.now(),
      })

      loading.value = true

      bot.value.recorder!(file)
        .then((res) => {
          emit('setInput', res.data.value?.text || '')
          emit('close')
        })
        .finally(() => {
          loading.value = false
          toggleIsrecording(false)
        })

      const rm = () => {
        start_rm()
        vaild_rm()
        stop_rm()
      }
      rm()
    })

    // 开始录音
    recorder.value.start()
  }
  catch (err) {
    error(t('footer.recorder.err'))
    toggleIsrecording(false)
  }
}

// 停止录音
function stopRecording() {
  recorder.value?.stop()
  // 释放 MediaRecorder 实例和音频流资源
  recorder.value = null
  chunks.value = []
}
</script>

<template>
  <div
    ref="container"
    z-9
    top--21px
    dark:bg="#2f2f2f"
    bg-white
    w-full
    absolute
    h-full
    rd="12px"
  >
    <div fc h-full>
      <NButton z-99 fc cursor-default type="success" text text-20px>
        <template v-if="!loading">
          <span v-if="!isRecording">{{ t("footer.recorder.start") }}</span>
          <span v-else>{{ t("footer.recorder.recording") }}</span>
        </template>
        <Icon
          :name="icon"
          transition-transform-1000
          cursor-pointer
          :style="`transform:translateX(${isRecording ? '10' : '0'}px);`"
          @click="handleButton"
        />
      </NButton>
      <Icon
        z-99
        ml-80px
        color="#de576d"
        cursor-pointer
        :size="25"
        name="line-md:remove"
        @click="emit('close')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading-box {
  --bg-color: #63e2b7;
}
.loading-box div:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 4.5px;
  background: linear-gradient(90deg, transparent, var(--bg-color));
  animation: btn-anim1 1s linear infinite;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 100%;
  }
}

.loading-box div:nth-child(2) {
  top: -100%;
  right: 0;
  width: 4.5px;
  height: 100%;
  background: linear-gradient(180deg, transparent, var(--bg-color));
  animation: btn-anim2 1s linear infinite;
  animation-delay: 0.25s;
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }
  50%,
  100% {
    top: 100%;
  }
}

.loading-box div:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 4.5px;
  background: linear-gradient(270deg, transparent, var(--bg-color));
  animation: btn-anim3 1s linear infinite;
  animation-delay: 0.5s;
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%,
  100% {
    right: 100%;
  }
}

.loading-box div:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 4.5px;
  height: 100%;
  background: linear-gradient(360deg, transparent, var(--bg-color));
  animation: btn-anim4 1s linear infinite;
  animation-delay: 0.75s;
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%,
  100% {
    bottom: 100%;
  }
}
</style>
