<script lang="ts" setup>
// import Balance from './Balance.vue'
import { useUIStore } from '@/store'

const UIStore = useUIStore()
const { fixedRight } = storeToRefs(UIStore)
const { setFixedRight, setShowRightDrawer, setShowTokenModal } = UIStore

const scrollCls = computed(() => (fixedRight.value ? 'max-h-96dvh ' : 'max-h-60vh pr-15px'))

const config = computed(() => bot.value.config)
const settingSchema = computed(() => bot.value.settingSchema)

// const hasToken = computed(() => bot.value.apiKey)
function handleChange(key: any, val: string) {
  unref(bot).setConfigByKey(key, val)
}
</script>

<template>
  <NScrollbar :class="scrollCls" w-full>
    <div fic justify-between pb-10px>
      <div fc h-40px>
        <span fc text-20px>
          {{ t('config.title') }}
        </span>
        <span fc>
          <Icon title="api-token" ml-6px name="lucide:key" :size="18" @click="setShowTokenModal(true)" />
        </span>
      </div>
      <div fc>
        <Icon
          :size="22"
          cursor-pointer
          :name="fixedRight ? 'tabler:arrows-diagonal-minimize' : 'tabler:arrows-diagonal-2'"
          @click="setFixedRight(!fixedRight)"
        />
        <Icon
          v-if="fixedRight"
          lg-display-none
          ml-20px
          cursor-pointer
          name="line-md:menu-fold-right"
          :size="25"
          @click="setShowRightDrawer(false)"
        />
      </div>
    </div>
    <!-- TODO -->
    <!-- <Balance v-if="hasToken" /> -->
    <Form :form-model="config" :form-items="settingSchema" @handle-change="handleChange" />
  </NScrollbar>
</template>
