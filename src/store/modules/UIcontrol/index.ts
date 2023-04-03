import { defineStore } from 'pinia'
import { ls } from '@/utils/cache'

interface UIState {
  // control the loading state when generating the answer
  isGenerating: boolean
  // control the drawer sidebar
  showDrawerSidebar: boolean

  // 配置表单是否固定在右侧
  fixedRight: boolean
  // 控制小屏右侧抽屉
  showRightDrawer: boolean

  showTokenModal: boolean

}

export const useUIStore = defineStore('UI-store', {
  state: (): UIState => ({
    isGenerating: false,
    showDrawerSidebar: false,
    fixedRight: ls.get('fixedRight') || false,
    showRightDrawer: false,
    showTokenModal: false,
  }),
  actions: {
    setGenerating(flag: boolean) {
      this.isGenerating = flag
    },
    setShowDrawerSidebar(flag: boolean) {
      this.showDrawerSidebar = flag
    },
    setFixedRight(flag: boolean) {
      this.fixedRight = flag
      ls.set('fixedRight', flag)
    },
    setShowRightDrawer(flag: boolean) {
      this.showRightDrawer = flag
    },
    setShowTokenModal(flag: boolean) {
      this.showTokenModal = flag
    },
  },
})

export function useUIStoreWithOut() {
  return useUIStore(store)
}
