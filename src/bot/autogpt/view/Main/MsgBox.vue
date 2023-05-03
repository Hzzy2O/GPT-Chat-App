<script lang="tsx">
import { NSpace } from 'naive-ui'
import { get } from 'lodash-es'
import type { AutoGPT } from '@/bot/autogpt/types'
import Icon from '@/components/Icon.vue'

export default defineComponent({
  props: {
    message: Object as PropType<AutoGPT.GPTAction>,
  },
  setup(props) {
    const config = [
      {
        icon: 'fluent-emoji:thinking-face',
        content: 'reply_json.thoughts.text',
        title: 'thoughts',
      },
      {
        icon: 'fluent-emoji:ledger',
        content: 'reply_json.thoughts.reasoning',
        title: 'reason',
      },
      {
        icon: 'fluent-emoji:triangular-flag',
        content: 'reply_json.thoughts.plan',
        title: 'plan',
      },
      {
        icon: 'fluent-emoji:hammer-and-wrench',
        content: 'reply_json.thoughts.criticism',
        title: 'criticism',
      },
      {
        icon: 'fluent-emoji:hammer-and-wrench',
        content: 'reply_json.command.name',
        title: 'utils',
      },
      {
        icon: 'fluent-emoji:memo',
        content: 'tool_result.result',
        title: 'result',
      },

    ]
    return () => {
      const row = (title: string, content: string, icon: string) => {
        const contentVal = get(props.message, content)
        return <div >
          <span inline-flex fic justify-start>
            <Icon name={icon} size={16} mr-4px />
            {t(`autogpt.${title}`)}:
          </span>
          <div ml-18px>{contentVal}</div>
        </div>
      }

      const RenderArg = () => {
        const args = get(props.message, 'reply_json.command.args')
        if (!args)
          return <div></div>

        return <div >
            <span inline-flex fic justify-start>
              <Icon name="fluent-emoji:package" size={16} />
              {t('autogpt.arguments')}:
            </span>
            <NSpace ml-18px>
              {
                Object.entries(args)
                  .map(([argName, argVal]) => {
                    return <span>
                    {argName}: {argVal}
                  </span>
                  })
              }

           </NSpace>
          </div>
      }

      return <div text-16px max-w-full break-all>
          <Icon class="!fc" name="bi:robot" size={22} />
          {
            config.map(item =>
              row(item.title, item.content, item.icon))
          }
          <RenderArg />
      </div>
    }
  },

})
</script>
