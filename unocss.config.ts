import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerAttributifyJsx,
  transformerDirectives,
} from 'unocss'

import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineConfig({
  shortcuts: [
    {
      'fjc': 'flex justify-center',
      'fic': 'flex items-center',
      'fc': 'fjc items-center',
      'bg1': 'bg-true-gray-50 dark:bg-true-gray-9',
      'shadow-1': 'shadow-[0px_-5px_5px_0px_black]',
      'shadow-2': 'shadow-[0px_5px_5px_0px_black]',
      'f-icon': 'ml-10px h-38px fjc items-center transition-opacity',
      'scroll-t': 'scrollbar scrollbar-rounded scrollbar-track-transparent',
      'card-modal': 'lg-w-80vw lg-bottom-36px w-90vw max-w-600px rd-12px',
    },
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetWebFonts({
      fonts: {
        sans: ['DM Sans', 'Noto Sans SC'],
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
    presetScrollbar(),
  ],
  rules: [
    // [/^letter-spacing-(\d+)$/, ([, d]) => ({ 'letter-spacing': `${d}px` })],
    // [/^w-(\d+)p$/, ([, d]) => ({ width: `${d}%` })],
  ],
  theme: {
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1536px',
      xxxl: '1736px',
    },
    colors: {
      main: '#E70819',
    },
  },
  transformers: [transformerDirectives(), transformerAttributifyJsx()],
})
