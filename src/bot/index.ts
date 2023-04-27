import OpenAI from './openai'
import Bing from './bing'
import AutoGPT from './autogpt'
import { Bot } from '#/index'

type BotInstance = typeof OpenAI | typeof Bing | typeof AutoGPT

export const botMap = new Map<Bot, BotInstance>([
  [Bot.openai, OpenAI],
  [Bot.bing, Bing],
  [Bot.autogpt, AutoGPT],
])

export const curBotType = useStorage<Bot>('botType', Bot.openai)

export const bot = computed(() => botMap.get(curBotType.value)!)

export const isBot = <T extends Bot>(b: BotInstance, type: T): b is Extract<BotInstance, { name: T }> => {
  return unref(b).name === type
}
