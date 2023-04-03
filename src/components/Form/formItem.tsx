import {
  NDivider,
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
    value: [String, Number, Boolean] as any,
  },
  emits: ['valueChange'],
  setup(props, { emit }) {
    const handleValueChange = (value: string | number | boolean) => {
      emit('valueChange', props.config?.key, value)
    }

    return () => {
      const { config, value } = props
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
                <NInput autofocus={false} rd-10px value={val.value} onUpdateValue={v => val.value = v} onBlur={() => {
                  handleValueChange(val.value)
                }} rule="itemrules" />
              </NInputGroup>
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
            v-slots={{
              label: () => labelRender(label),
              default: () => <DynamicComponent />,
            }}
            rule={rule}
          ></NFormItem>
          <NDivider class="my-8px!" />
        </>
      )
    }
  },
})
