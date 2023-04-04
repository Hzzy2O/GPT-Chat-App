export const currentSpeechText = ref('')

export const speechInstance = useSpeechSynthesis(currentSpeechText, {
  lang: 'zh-CN',
})
