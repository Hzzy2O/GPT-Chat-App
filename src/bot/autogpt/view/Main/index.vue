<script lang="ts" setup>

</script>

<template>
  <NLayoutContent h="[calc(100dvh-195px)]" bg2 overflow-hidden>
    <div animate-fade-in w-full h-full fc flex-col>
      <Icon name="bi:robot" :size="90" mb-20px />
      <span text-20px>{{ t('autogpt.nodata') }}</span>
    </div>
  </NLayoutContent>
  <!-- <NScrollbar v-else ref="scrollEl" h-full trigger="none"> -->
  <!--   <NList -->
  <!--     id="chatList" -->
  <!--     bg-transparent -->
  <!--     :style="`min-height: calc(100dvh - ${suggestionHeight + 200}px)`" -->
  <!--     :show-divider="false" -->
  <!--   > -->
  <!--     <NListItem v-for="flow in flowList" :key="flow.id"> -->
  <!--       <ChatBox -->
  <!--         :chat-data="flow" -->
  <!--       /> -->
  <!--     </NListItem> -->
  <!--     <div v-if="isGenerating" fc dark:color-white> -->
  <!--       <span text-18px mr-5px>{{ t('main.chat.thinking') }}</span> -->
  <!--       <iconify-icon width="20" icon="svg-spinners:blocks-wave" /> -->
  <!--     </div> -->
  <!--   </NList> -->
  <!-- <template v-if="suggestions?.length"> -->
  <!--   <div ref="suggestionRef" w-full justify-end fic flex="gap-8px wrap"> -->
  <!--     <label v-for="sug in suggestions" :key="sug" :title="sug" @click="setQueryInputVal(sug)"> -->
  <!--       <NTag cursor-pointer mx-8px round type="primary" max-w-260px truncate> -->
  <!--         {{ sug }} -->
  <!--       </NTag> -->
  <!--     </label> -->
  <!--   </div> -->
  <!-- </template> -->
  <!-- </NScrollbar> -->
</template>
