import type { Ref } from 'vue'
import type { FormItemRule, SelectRenderLabel } from 'naive-ui'

export interface BaseItem {
  key: string
  label: string
  rule?: FormItemRule
  desc?: string
}

export interface InputItem extends BaseItem {
  type: 'input'
  prefix?: string
  placeholder?: string
}

export interface RadioItem extends BaseItem {
  type: 'radio'
  options?: LabelValueOptions | Ref<LabelValueOptions>
}

export interface SelectItem extends BaseItem {
  type: 'select'
  options?: LabelValueOptions | Ref<LabelValueOptions>
  renderLabel?: SelectRenderLabel
}

export interface SwitchItem extends BaseItem {
  type: 'switch'
}

export interface SliderItem extends BaseItem {
  type: 'slider'
  min?: number
  max?: number
  step?: number
}

export interface DynamicInputItem extends BaseItem {
  type: 'dynamicInput'
  min?: number
  max?: number
}

export interface CollapseItem {
  label: string
  type: 'collapse'
  items: FormItem[]
}

export type FormItem = InputItem | RadioItem | SelectItem | SwitchItem | SliderItem | DynamicInputItem

export type FormConfig = Array<FormItem | CollapseItem>
