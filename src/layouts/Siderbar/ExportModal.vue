<script setup lang="ts">
import { toJpeg } from 'html-to-image'
import { NPopover } from 'naive-ui'
import { generateId } from '@/utils'

const showPopover = ref(false)

function exportImg() {
  toJpeg(
    document.querySelector('#chatList') as HTMLElement,
    {
      // quality: 0.95,
      // style: {
      //   transform: 'scale(0.5)',
      //   transformOrigin: 'top left',
      //   width: '1000px',
      //   height: '1000px',
      // },
      backgroundColor: isDark.value ? '#000' : '#fff',
    },
  ).then((url) => {
    const a = document.createElement('a')
    a.href = url
    a.download = `ChatGPT-${generateId()}.jpg`
    a.click()
    showPopover.value = false
  })
}
</script>

<template>
  <NPopover
    :show="showPopover"
    trigger="click"
    bg-transparent
    class="!p-0 !rd-8px"
    placement="top"
    @clickoutside="showPopover = false"
  >
    <template #trigger>
      <div pl-2px fic>
        <Icon name="mdi:export" mr-8px :size="24" />
        <span cursor-pointer @click="showPopover = !showPopover">{{ t('siderbar.exportCurrent') }}</span>
      </div>
    </template>
    <NButtonGroup vertical bg1 rd-8px>
      <NButton rd-8px @click="exportImg">
        {{ t('siderbar.exportImg') }}
      </NButton>
      <!-- <NButton rd-8px> -->
      <!--   按钮 -->
      <!-- </NButton> -->
    </NButtonGroup>
  </NPopover>
</template>
