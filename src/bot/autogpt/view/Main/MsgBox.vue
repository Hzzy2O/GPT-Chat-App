<script lang="ts" setup>
import type { AutoGPT } from '@/bot/autogpt/types'
defineProps<{
  message: AutoGPT.GPTAction
}>()
</script>

<template>
  <NThing text-16px>
    <template #avatar>
      <Icon name="bi:robot" :size="18" />
    </template>
    <template #header>
      <div>运行工具: {{ message.tool_result.name }}</div>
      <div>执行结果: {{ message.tool_result.result }}</div>
    </template>
    <template #description>
      <div v-if="message.reply_json.thoughts">
        <div>
          想法: {{ message.reply_json.thoughts.text }}
        </div>
        <div>
          原因: {{ message.reply_json.thoughts.reasoning }}
        </div>
        <div>
          计划: {{ message.reply_json.thoughts.plan }}
        </div>
        <div>
          批判: {{ message.reply_json.thoughts.criticism }}
        </div>
        <div />
      </div>
      <div>
        <div>
          使用工具: {{ message.reply_json.command.name }}
        </div>
        <div>
          参数:
          <NSpace>
            <span
              v-for="[argName, argVal] in Object.entries(message.reply_json.command.args)"
              :key="argName"
            >
              {{ argName }}: {{ argVal }}
            </span>
          </NSpace>
        </div>
      </div>
      <!-- <span>{{ goal }}</span> -->
    </template>
  </NThing>
</template>
