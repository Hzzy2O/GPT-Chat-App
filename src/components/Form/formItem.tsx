import type { FormItemProps } from 'naive-ui'
import {
  NDivider,
  NDynamicInput,
  NFormItem,
  NInput,
  NInputGroup,
  NPopover,
  NRadioButton,
  NRadioGroup,
  NSelect,
  NSlider,
  NSwitch,
} from 'naive-ui'
import type { FormItem } from './types'
import Icon from '@/components/Icon.vue'

export default defineComponent({
  props: {
    config: Object as PropType<FormItem>,
    value: [String, Number, Boolean, Array] as any,
    noDivider: Boolean as PropType<boolean>,
    decorator: Object as PropType<FormItemProps>,
  },
  emits: ['valueChange'],
  setup(props, { emit }) {
    function handleValueChange<T>(value: T) {
      emit('valueChange', props.config?.key, value)
    }

    return () => {
      const { config, value, noDivider } = props
      if (!config)
        return undefined

      const { label: _label, type, rule } = config
      const label = t(_label)

      const DynamicComponent = () => {
        switch (type) {
          case 'input': {
            const val = ref(value)
            return (
              <NInputGroup>
                <NInput
                  autofocus={false}
                  rd-10px
                  placeholder={t(config.placeholder || 'config.placeholder')}
                  value={val.value}
                  onUpdateValue={v => val.value = v}
                  onBlur={() => {
                    handleValueChange(val.value)
                  }} rule="itemrules" />
              </NInputGroup>
            )
          }

          case 'dynamicInput': {
            const val = ref(toRaw(value))
            const update = (v: string, idx: number) => Reflect.set(val.value, idx, v)
            return (
              <NDynamicInput
                value={val.value}
                onCreate={() => val.value.push('')}
                onRemove={index => val.value.splice(index, 1)}
                max={config.max}
                min={config.min}
                v-slots={{
                  default: ({ value, index }) =>
                  <NInput
                    placeholder={t('config.placeholder')}
                    onUpdateValue={v => update(v, index)}
                    value={value}
                    onBlur={() => handleValueChange(val.value)}
                    />,
                }}
              />
            )
          }

          case 'radio':
            return (
              <NRadioGroup value={value} onUpdateValue={handleValueChange}>
                {unref(config.options)?.map((option) => {
                  return (
                    <NRadioButton
                      value={option.value}
                      key={option.value}
                      label={t(option.label)}
                    ></NRadioButton>
                  )
                })}
              </NRadioGroup>
            )

          case 'select':
            return (
              <NSelect
                renderLabel={config.renderLabel}
                value={value}
                onUpdateValue={handleValueChange}
                options={unref(config.options)}
              />
            )

          case 'switch':
            return <NSwitch value={value} onUpdateValue={handleValueChange} />

          case 'slider':
            return (
              <NSlider
                min={config.min}
                max={config.max}
                step={config.step}
                value={value}
                onUpdateValue={handleValueChange}
              />
            )

          default:
            return <></>
        }
      }

      const labelRender = (label: string) => (
        <div class="fc">
          {label}
          {config.desc && (
            <NPopover
              max-w-250px
              v-slots={{
                default: () => <span>{t(config.desc!)}</span>,
                trigger: () => <Icon ml-4px size={14} name="majesticons:info-circle-line" />,
              }}
            ></NPopover>
          )}
        </div>
      )

      return (
        <>
          <NFormItem
            {...props.decorator}
            path={props.config?.key}
            v-slots={{
              label: () => labelRender(label),
              default: () => <DynamicComponent />,
            }}
            rule={rule}
          ></NFormItem>
          {!noDivider ? <NDivider class="my-8px!" /> : <div h-16px />}
        </>
      )
    }
  },
})
