import type { Ref } from 'vue'
import OpenAI from './openai'
import Bing from './bing'
import { Bot } from '#/index'

const openAI = new OpenAI()
const bing = new Bing()

type BotInstance = OpenAI | Bing

export const botMap = new Map<Bot, BotInstance>()
botMap.set(Bot.openai, openAI)
botMap.set(Bot.bing, bing)

export const curBotType = useStorage<Bot>('botType', Bot.openai)

export const bot = computed(() => botMap.get(curBotType.value)!)

export const isOpenai = (b: BotInstance | Ref<BotInstance>): b is OpenAI =>
  unref(b).name === Bot.openai

export const isBing = (b: BotInstance | Ref<BotInstance>): b is Bing => unref(b).name === Bot.bing
