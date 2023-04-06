<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui'
import type { FileInfo } from 'naive-ui/es/upload/src/interface'

const props = defineProps<{
  imgInfo: {
    img?: Nullable<FileInfo>
    mask?: Nullable<FileInfo>
  }
}>()
const emit = defineEmits(['close', 'setImgInfo'])

const imgs = ref<FileInfo[]>([])
const masks = ref<FileInfo[]>([])

const showModal = ref(false)
const toggleModal = (show: boolean) => {
  showModal.value = show
  if (show) {
    imgs.value = props.imgInfo.img ? [props.imgInfo.img] : []
    masks.value = props.imgInfo.mask ? [props.imgInfo.mask] : []
  }
}

function setImgs() {
  emit('setImgInfo', imgs.value[0], masks.value[0])
}
const { error } = useMessage()

async function beforeUpload(data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) {
  if (data.file.file?.type !== 'image/png') {
    error('只能上传png格式的图片文件，请重新上传')
    return false
  }
  if (data.file.file.size > 1024 * 1024 * 4) {
    error('图片大小不能超过2M，请重新上传')
    return false
  }
  return true
}

defineExpose({
  openModal: () => toggleModal(true),
})
</script>

<template>
  <NModal
    :show="showModal"
    preset="dialog"
    rd-10px
    :show-icon="false"
    :title="t('footer.mode.editImg')"
    :positive-text="t('common.confirm')"
    @positive-click="setImgs"
    @update-show="toggleModal"
  >
    <div fic justify-start flex-gap-40px>
      <NFormItem :label="t('footer.editImg.img')">
        <NUpload
          v-model:file-list="imgs"
          list-type="image-card"
          :max="1"
          accept=".png"
          @before-upload="beforeUpload"
        />
      </NFormItem>
      <NFormItem :label="t('footer.editImg.mask')">
        <NUpload
          v-model:file-list="masks"
          list-type="image-card"
          :max="1"
          accept=".png"
          @before-upload="beforeUpload"
        />
      </NFormItem>
    </div>
  </NModal>
</template>
