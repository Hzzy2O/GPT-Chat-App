<script lang="tsx">
  import { NLayoutHeader, NPopselect } from 'naive-ui'
  import Settings from './Settings/index.vue'
  import TokenModal from './TokenModal.vue'
  import Icon from '@/components/Icon.vue'
  import { useUIStore } from '@/store'
  import { Bot } from '#/.'
  import { enumToOptions } from '@/utils'

  export default defineComponent({
    setup() {
      // UI state control
      const UIstore = useUIStore()
      const { setShowDrawerSidebar, setShowRightDrawer } = UIstore
      const { showDrawerSidebar, fixedRight } = storeToRefs(UIstore)

      return () => {
        if (!bot.value)
          return undefined
        const { iconName, name } = bot.value

        // 切换主题
        const DarkToggle = () => (
          <Icon
            cursor-pointer
            color-orange-4
            dark:color-amber-3
            size={39}
            onClick={(e: Event) => {
              toggleDark()
              e.stopPropagation()
            }}
            name={
              isDark.value
                ? 'line-md:moon-rising-twotone-loop'
                : 'line-md:moon-to-sunny-outline-loop-transition'
            }
          />
        )

        // 配置按钮
        const SettingBtn = () => {
          return fixedRight.value
            ? (
            <Icon
              name="line-md:menu-fold-left"
              lg-display-none
              onClick={() => setShowRightDrawer(true)}
            />
              )
            : (
            <Settings>
              <Icon size={35} name="line-md:edit" />
            </Settings>
              )
        }

        // 机器人类型选择
        const BotSelect = () => {
          const setValue = (value: Bot) => {
            curBotType.value = value
          }

          return (
            <NPopselect
              value={name}
              onUpdateValue={setValue}
              options={enumToOptions(Bot)}
              size="medium"
              scrollable
            >
              <div text-18px fc cursor-pointer>
                <Icon size={30} name={iconName} />
              </div>
            </NPopselect>
          )
        }

        // 语言选择
        const LanguageButton = () => {
          const icon
            = locale.value === 'zh-CN' ? 'icon-park-outline:english' : 'icon-park-outline:chinese'
          const setValue = () => {
            setLocale(locale.value === 'zh-CN' ? 'en-US' : 'zh-CN')
          }
          return <Icon size={32} name={icon} onClick={() => setValue()} />
        }

        const rightItems = [LanguageButton, DarkToggle, SettingBtn]

        // 控制左侧抽屉
        const ControlMenu = () => {
          const name = showDrawerSidebar.value
            ? 'line-md:menu-to-close-alt-transition'
            : 'line-md:close-to-menu-alt-transition'
          return (
            <Icon
              lg-display-none
              name={name}
              onClick={() => setShowDrawerSidebar(true)}
              cursor-pointer
            />
          )
        }

        const leftItems = [ControlMenu, BotSelect]
        return (
          <NLayoutHeader bg1 w-full h-80px flex justify-between px-15px shadow>
            <div fic>
              {leftItems.map(item => (
                <div h-full flex items-center pr-15px>
                  {item()}
                </div>
              ))}
            </div>
            <div fic>
              {rightItems.map(item => (
                <div h-full flex items-center pr-15px>
                  {item()}
                </div>
              ))}
            </div>
            <TokenModal />
          </NLayoutHeader>
        )
      }
    },
  })
</script>
