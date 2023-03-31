import { createI18n } from 'vue-i18n'
import en from './en-US.json'
import cn from './zh-CN.json'
import type { Language } from '#/.'

const { language: _lg } = useNavigatorLanguage()

export const locale = useStorage('locale', _lg.value)

const i18n = createI18n({
  locale: locale.value,
  fallbackLocale: 'en-US',
  allowComposition: true,
  messages: {
    'en-US': en,
    'zh-CN': cn,
  },
  silentTranslationWarn: true,
  silentFallbackWarn: true,
})

export function t(key: string) {
  return i18n.global.t(key)
}

export function setLocale(_locale: Language) {
  locale.value = _locale
  i18n.global.locale = _locale
}

export default i18n
