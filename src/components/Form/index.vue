<script lang="ts" setup>
import type { FormInst } from 'naive-ui'
import type { FormConfig } from './types'
import FormItem from './formItem'

const props = defineProps<{
  formModel: Record<string, any>
  formItems: FormConfig
  noDivider?: boolean
}>()
const emit = defineEmits<{
  (event: 'handleChange', key: string, val: any): void
}>()

const formRef = ref<Nullable<FormInst>>(null)

function valueChange(key: string, val: any) {
  emit('handleChange', key, val)
}
const formModel = computed(() => props.formModel)
</script>

<template>
  <NForm v-bind="$attrs" ref="formRef" :model="formModel" :show-require-mark="false">
    <template
      v-for="(item, index) in formItems"
      :key="item.key"
    >
      <NCollapse v-if="item.type === 'collapse'">
        <NCollapseItem :title="t(item.label)" :name="index">
          <template v-for="formItem in item.items" :key="formItem.key">
            <FormItem
              :value="formModel[formItem.key]"
              :no-divider="props.noDivider"
              :config="formItem"
              @value-change="valueChange"
            />
          </template>
        </NCollapseItem>
      </NCollapse>
      <template v-else>
        <FormItem
          v-if="typeof item.ifShow === 'function' ? item.ifShow(formModel) : true"
          :decorator="item.decorator || {}"
          :value="formModel[item.key]"
          :no-divider="props.noDivider"
          :config="item"
          @value-change="valueChange"
        />
      </template>
    </template>
  </NForm>
</template>

<style lang="scss">
  .n-form-item-feedback-wrapper {
    display: none;
  }
  .n-button {
    --n-button-border-radius: 10px;
  }
  .n-input {
    border-radius: 10px!important;
  }

  .n-base-selection,
  .n-base-select-menu,
  .n-base-select-option {
    border-radius: 10px !important;
  }
</style>
