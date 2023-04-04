<script lang="ts" setup>
import MdBox from './MdBox'
import type { Flow } from '#/.'
import { Role } from '#/.'

const { chatData } = defineProps<{
  chatData: Flow
}>()
const { msg, urls, type, imgs, done } = toRefs(chatData)
const isUser = type?.value === Role.user
const containerCls = isUser ? 'justify-end' : 'justify-start'

const toUrl = (url: string) => window.open(url, '_blank')
const boxCls = isUser
  ? 'bg-[var(--theme-color)] text-white animate-bounce-in-right'
  : 'bg2 dark:bg-dark-1 animate-bounce-in-left'
</script>

<template>
  <div w-full flex :class="containerCls">
    <div
      class="chatbox"
      transition-transform
      max-w="95%"
      lg-max-w="60%"
      px-25px
    >
      <div
        shadow
        border="1px solid gray-2"
        dark:border-color-transparent
        px-15px
        py-10px
        :class="boxCls"
        rd-25px
        border-box
      >
        <!-- 文本展示 -->
        <MdBox v-if="msg" :text="msg" :is-user="isUser" />
        <!-- 图片展示 -->
        <NImageGroup v-if="imgs">
          <NSpace max-w-210px sm-max-w-412px>
            <NImage
              v-for="img in imgs"
              :key="img"
              rd-8px
              shadow
              :src="img"
              :alt="img"
              :width="200"
              :height="200"
              fit="cover"
              :preview-src="img"
              :preview-options="{ zIndex: 9999 }"
            >
              <template #placeholder>
                <div w-200px h-200px fc>
                  <Icon name="svg-spinners:90-ring-with-bg" />
                </div>
              </template>
            </NImage>
          </NSpace>
        </NImageGroup>
        <!-- 链接展示 -->
        <div v-if="urls?.length" flex flex-wrap w-full mt-10px>
          <span v-if="urls.length">{{ t("main.chat.link") }}：</span>
          <div
            v-for="item in urls"
            :key="item.url"
            mr-10px
            mb-5px
            overflow-hidden
            rd-20px
          >
            <label :title="item.title">
              <NTag :bordered="false" round pb-10px>
                <div
                  hover-underline
                  overflow-hidden
                  underline-offset-1
                  ws-nowrap
                  max-w-120px
                  text-ellipsis
                  @click="toUrl(item.url)"
                >
                  {{ item.title }}
                </div>
              </NTag>
            </label>
          </div>
        </div>
        <!-- TODO -->
        <!-- <Actions v-if="!isUser && done" /> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.chatbox li {
  display: flex;
  align-items: center;
  justify-content: start;
  flex-wrap: wrap;
}

.generating::after {
  content: "";
  position: inline-block;
  width: 4px;
  height: 10px;
  border-left: 2px solid black;
  animation: blink 1s infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
