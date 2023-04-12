<script setup lang="ts">
import { toJpeg } from 'html-to-image'
import { generateId } from '@/utils'
// 余额展示

function exportImg() {
  toJpeg(
    document.querySelector('#chatList')!,
    {
      // quality: 0.95,
      // style: {
      //   transform: 'scale(0.5)',
      //   transformOrigin: 'top left',
      //   width: '1000px',
      //   height: '1000px',
      // },
    },
  ).then((url) => {
    const a = document.createElement('a')
    a.href = url
    a.download = `ChatGPT-${generateId()}.jpg`
    a.click()
  })
}

// const balanceMsg = computed(() => balance.value?.().balanceMsg)
</script>

<template>
  <div p="x-20px y-8px">
    <slot />
    <!-- <div @click="toJpeg"> -->
    <!--   导出图片 -->
    <!-- </div> -->
  </div>
</template>
