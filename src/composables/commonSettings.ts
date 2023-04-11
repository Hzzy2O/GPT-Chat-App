import Tiny from 'tinycolor2'
import type { GlobalThemeOverrides } from 'naive-ui'
import { ls } from '@/utils/cache'

export const commonSettings = useStorage('commonSettings', {
  isShowTokenCost: false,
  themeColor: '#ff1d5e',
}, ls)

export const getThemeOverrides = computed(() => {
  const color = commonSettings.value.themeColor
  const primaryColor = Tiny(color).toHex8String()
  const hoverColor = Tiny(color)
    .lighten(7.5)
    .brighten(1)
    .desaturate(20)
    .spin(-2)
    .toHex8String()
  const themeOverrides: GlobalThemeOverrides = {
    common: {
      primaryColor,
      primaryColorHover: hoverColor,
      primaryColorPressed: Tiny(color).darken(10).saturate(8).spin(2).toHex8String(),
      primaryColorSuppl: hoverColor,
    },
    Switch: {
      railColorActive: primaryColor,
    },
    Slider: {
      fillColor: primaryColor,
      fillColorHover: hoverColor,
    },
  }

  return themeOverrides
})
