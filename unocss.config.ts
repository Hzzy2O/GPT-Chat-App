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
      'bg1': 'bg-light-1 dark:bg-true-gray-9',
      'bg2': 'bg-white dark:bg-true-gray-9',
      'hbg1': 'hover:bg-zinc-2 dark:bg-true-gray-9',
      'shadow-1': 'shadow-[0px_-5px_5px_0px_black] dark:shadow-[0px_-5px_5px_0px_white]',
      'shadow-2': 'shadow-[0px_5px_5px_0px_black]',
      'shadow-3': 'shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(255,255,255,0.1)]',
      'shadow-4': 'shadow-[0_0_2px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_0_2px_2px_rgba(255,255,255,0.1)]',
      'shadow-head': 'shadow-[0px_0px_8px_rgba(0,0,0,0.1)]',
      'f-icon': 'ml-10px h-38px fjc items-center transition-opacity',
      'scroll-t': 'scrollbar scrollbar-rounded ',
      'card-modal': 'lg-w-80vw lg-bottom-36px w-90vw max-w-600px rd-12px',
      'zoomin': 'animate-zoom-in animate-duration-200',
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
      lightbg: '#faf6fe60',
    },
  },
  transformers: [transformerDirectives(), transformerAttributifyJsx()],
})
