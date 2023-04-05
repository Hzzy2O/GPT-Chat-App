export const currentSpeechText = ref('')
export const currentSpeechId = ref('')

export const speechInstance = useSpeechSynthesis(currentSpeechText, {
  lang: 'zh-CN',
})
