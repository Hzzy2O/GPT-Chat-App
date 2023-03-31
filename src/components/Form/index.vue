<script lang="ts" setup>
import type { FormInst } from 'naive-ui'
import type { FormConfig } from './types'
import FormItem from './formItem'
import { useUIStore } from '@/store'

const props = defineProps<{
  formModel: Record<string, any>
  formItems: FormConfig
}>()
const emit = defineEmits<{
  (event: 'handleChange', key: string, val: any): void
}>()
const UIStore = useUIStore()
const { fixedRight } = storeToRefs(UIStore)

const expandArr = computed(() => (fixedRight.value ? props.formItems.map((_, i) => i) : []))

const formRef = ref<Nullable<FormInst>>(null)

function valueChange(key: string, val: any) {
  emit('handleChange', key, val)
}
const formModel = props.formModel
</script>

<template>
  <NForm ref="formRef" :model="formModel" :show-require-mark="false">
    <template
      v-for="(item, index) in formItems"
      :key="item.key"
    >
      <NCollapse v-if="item.type === 'collapse'" :default-expanded-names="expandArr">
        <NCollapseItem :title="t(item.label)" :name="index">
          <template v-for="formItem in item.items" :key="formItem.key">
            <FormItem :value="formModel[formItem.key]" :config="formItem" @value-change="valueChange" />
          </template>
        </NCollapseItem>
      </NCollapse>
      <FormItem v-else :value="formModel[item.key]" :config="item" @value-change="valueChange" />
    </template>
  </NForm>
</template>

<style lang="scss">
  .n-form-item-feedback-wrapper {
    display: none;
  }
</style>
