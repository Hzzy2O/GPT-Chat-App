import { NPopover } from 'naive-ui'

// 模型选择器的标签渲染
export const modelSelectLabel = (option: any) => (
  <NPopover
    v-slots={{
      default: () => {
        return locale.value === 'en-US'
          ? (
          <>
            <div text-16px>Descrption:</div>
            <div>{option.desc}</div>
            <div mt-10px text-16px>
              Max Tokens:
            </div>
            <div>{option.tokens}</div>
          </>
            )
          : (
          <div w-100px sm-w-200px>
            <div text-16px>描述:</div>
            <div>{option['zh-desc']}</div>
            <div mt-10px text-16px>
              最大词数:
            </div>
            <div>{option.tokens}</div>
          </div>
            )
      },
      trigger: () => <span>{option.label}</span>,
    }}
    placement="left-end"
  ></NPopover>
)
