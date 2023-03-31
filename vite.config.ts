import { resolve } from 'node:path'
import type { ConfigEnv, UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { createHtmlPlugin } from 'vite-plugin-html'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

const pathResolve = (dir: string) => resolve(process.cwd(), '.', dir)

export default ({ command }: ConfigEnv): UserConfig => {
  const root = process.cwd()

  return {
    root,
    json: {
      stringify: true,
    },
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: `${pathResolve('src')}/`,
        },
        {
          find: /#\//,
          replacement: `${pathResolve('types')}/`,
        },
      ],
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      // https: true
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: true,
        },
      },
      chunkSizeWarningLimit: 2000,
    },
    plugins: [
      Unocss(),

      Vue({
        reactivityTransform: true,
        template: {
          compilerOptions: {
            isCustomElement: tag => ['iconify-icon'].includes(tag),
          },
        },
      }),

      vueJsx(),

      VitePWA({
        injectRegister: 'auto',
        manifest: {
          name: 'Chat Web',
          short_name: 'Chat Web',
          icons: [
            { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
      }),

      Pages(),

      AutoImport({
        imports: [
          'vue',
          'vue/macros',
          'vue-router',
          '@vueuse/core',
          'pinia',
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
          },
        ],
        dts: './types/auto-import.d.ts',
        dirs: ['./src/composables', './src/store', './src/locales', './src/bot'],
        vueTemplate: true,
      }),

      Components({
        resolvers: [NaiveUiResolver()],
        dts: './types/components.d.ts',
      }),

      createSvgIconsPlugin({
        iconDirs: [pathResolve('src/assets/svg')],
        svgoOptions: true,
        symbolId: 'svg-[dir]-[name]',
      }),

      vueSetupExtend(),

      createHtmlPlugin({
        minify: true,
      }),

      // basicssl(),

      // command === 'build' && visualizer(),
    ],
  }
}
