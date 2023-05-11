<script lang="ts" setup>
import Actions from '../Actions/index.vue'
import MdBox from './MdBox'
import UserBox from './UserBox.vue'
import AdaptiveCard from './AdaptiveCard.vue'
import type { Flow } from '#/.'
import { Bot, Role } from '#/.'

import { isBot } from '@/bot'

const { chatData } = defineProps<{
  chatData: Flow
}>()

const { msg, urls, type, imgs, done, frame_url } = toRefs(chatData)
const isUser = type?.value === Role.user
const containerCls = isUser ? 'justify-end' : 'justify-start'

const toUrl = (url: string) => window.open(url, '_blank')
const boxCls = `dark:border-color-transparent ${isUser
  ? 'bg-[var(--theme-color)] text-white animate-bounce-in-right'
  : 'bg2 dark:bg-dark-1 animate-bounce-in-left'}`

const mdRef = ref<typeof MdBox>()
function setPlayText() {
  currentSpeechText.value = mdRef.value?.elRef.innerText
  currentSpeechId.value = chatData.id

  if (currentSpeechText.value)
    speechInstance.speak()
}
function stopPlay() {
  speechInstance.stop()
}
const isPlay = computed(() => speechInstance.isPlaying.value && currentSpeechId.value === chatData.id)

const isShowTokenCost = computed(() => isBot(bot.value, Bot.openai) && bot.value.config.show_token_cost)
</script>

<template>
  <div w-full flex :class="containerCls">
    <div
      class="chatbox"
      transition-transform
      max-w="95%"
      lg-max-w="60%"
      px-25px
      relative
    >
      <div
        shadow
        border="1px solid gray-2"
        px-15px
        py-10px
        :class="boxCls"
        rd-25px
        border-box
      >
        <NCollapse
          v-if="chatData.plugin"
          w-full
          arrow-placement="right"
        >
          <template #header-extra>
            <n-icon><cash-icon /></n-icon>
          </template>
          <NCollapseItem
            truncate
          >
            <template #header>
              <div p-10px border-1 rd-12px fc truncate relative max-w="100%">
                <div>{{ t('main.plugin.inuse') }}:</div>
                <div w="100%" truncate ml-5px>
                  {{ chatData.plugin.name }}
                </div>
              </div>
            </template>
            <div
              v-for="(item, index) in chatData.plugin.log"
              :key="index"
              ws-pre
              break-words
              overflow-x-auto
              bg1
              p-15px
              rd-12px
              shadow-3
            >
              {{ item }}
            </div>
          </NCollapseItem>
        </NCollapse>
        <!-- 文本展示 -->
        <UserBox v-if="isUser" :text="msg" />
        <MdBox v-else-if="msg" ref="mdRef" :text="msg" />
        <!-- 图片展示 -->
        <NImageGroup v-if="chatData.imgs">
          <NSpace max-w-210px sm-max-w-412px>
            <NImage
              v-for="img in chatData.imgs"
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
            <label :title="item.title || item.url">
              <NTag :bordered="false" round pb-10px>
                <div
                  hover-underline
                  overflow-hidden
                  underline-offset-1
                  ws-nowrap
                  max-w-120px
                  text-ellipsis
                  leading-15px
                  @click="toUrl(item.url)"
                >
                  {{ item.title || item.url }}
                </div>
              </NTag>
            </label>
          </div>
        </div>
        <div v-if="frame_url">
          <AdaptiveCard :url="frame_url" />
        </div>
        <div text-12px animate-fade-in fic justify-between>
          <span v-if="isShowTokenCost && chatData.tokenCost">token cost: {{ chatData.tokenCost }}</span>
          <Actions v-if="!isUser && done" :is-play="isPlay" @play="setPlayText" @stop="stopPlay" />
        </div>
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
