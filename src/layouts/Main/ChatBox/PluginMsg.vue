<script lang="ts" setup>
import type { Plugin } from '#/index'

const props = defineProps<{
  plugin: Plugin
}>()

const logs = [
  {
    title: 'request',
    field: 'request',
  },
  {
    title: 'response',
    field: 'response',
  },
]

const showLogs = computed(() => {
  return logs.filter(log => props.plugin[log.field])
})
</script>

<template>
  <NCollapse
    w-full
    arrow-placement="right"
  >
    <NCollapseItem
      truncate
      rd-12px
      p-3px
    >
      <template #header>
        <div
          p-10px
          border1
          rd-12px
          fc
          truncate
          relative max-w="100%"
          bg1
        >
          <div>
            {{ t('main.plugin.inuse') }}:
          </div>
          <div w="100%" truncate ml-5px>
            {{ plugin.name }}
          </div>
        </div>
      </template>
      <div
        v-for="(item, index) in showLogs"
        :key="index"
        shadow-3
        rd-10px
        mb-10px
        overflow-hidden
      >
        <div
          bg="zinc-7 dark:true-gray-2"
          color-white
          p-6px
        >
          {{ t(`main.plugin.${item.title}`) }}
        </div>
        <NScrollbar
          p-2px
          x-scrollable
        >
          <div
            ws-pre
            break-words
            bg1
            p-15px
            rd-12px
          >
            {{ plugin[item.field] }}
          </div>
        </NScrollbar>
      </div>
    </NCollapseItem>
  </NCollapse>
</template>
