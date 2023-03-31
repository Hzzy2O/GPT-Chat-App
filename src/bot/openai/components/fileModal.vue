<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui'

const message = useMessage()
const fileList = ref<UploadFileInfo[]>([
  {
    id: 'a',
    name: '我错了.png',
    status: 'error',
  },
  {
    id: 'b',
    name: '普通文本.doc',
    status: 'finished',
    type: 'text/plain',
  },
  {
    id: 'c',
    name: '图片.png',
    status: 'finished',
    url: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
  },
  {
    id: 'd',
    name: '没传完.doc',
    status: 'uploading',
    percentage: 50,
  },
])

const createThumbnailUrl = (file: File | null): Promise<string> | undefined => {
  if (!file)
    return undefined
  message.info(
    'createThumbnailUrl 产生了图片的 URL，你传什么都会变成 07akioni',
  )
  message.info(`${file.name}`)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
      )
    }, 1000)
  })
}
</script>

<template>
  <NModal>
    <n-upload
      action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
      :default-file-list="fileList"
      list-type="image"
      :create-thumbnail-url="createThumbnailUrl"
    >
      <n-button>上传文件</n-button>
    </n-upload>
  </NModal>
</template>
