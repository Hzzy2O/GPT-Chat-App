import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'

const svgCopy
  = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M4 4.085V10.5a2.5 2.5 0 0 0 2.336 2.495L6.5 13h4.414A1.5 1.5 0 0 1 9.5 14H6a3 3 0 0 1-3-3V5.5a1.5 1.5 0 0 1 1-1.415ZM11.5 2A1.5 1.5 0 0 1 13 3.5v7a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 5 10.5v-7A1.5 1.5 0 0 1 6.5 2h5Z"/></svg>'

const mdi = new MarkdownIt({
  linkify: true,
  highlight: (code, language) => {
    const lang = language ?? ''
    const highlighted = lang
      ? hljs.highlight(code, { language: lang }).value
      : hljs.highlightAuto(code).value
    return `<copyable-pre flex>
          <pre grid shadow relative my-5px rd-10px overflow-hidden>
            <div px-10px py-4px bg="zinc-7 dark:true-gray-2" justify-between text="white dark:black" fic>
            <span>${language}</span>
            <span block overflow-hidden flex>
             <label flex items-center cursor-pointer h-20px title="copy code">
              ${svgCopy} 
             </label>
            </span>
            </div>
            <code class="hljs ${lang}" scrollbar 
            scrollbar-track-color-transparent scrollbar-rounded 
            !px-12px !py-8px>${highlighted}</code>
          </pre>
        </copyable-pre>`
  },
})

mdi.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  // 添加 target='_blank' 属性
  tokens[idx].attrPush(['target', '_blank'])
  tokens[idx].attrPush(['hover-underline', ''])
  // 调用默认的渲染方法
  const link = self.renderToken(tokens, idx, options)
  return `<span hover-dashed text-12px relative bottom-3px>[${link}`
}
mdi.renderer.rules.link_close = function () {
  return '</a>]</span>'
}

mdi.renderer.rules.code_inline = function (tokens, idx) {
  const code = tokens[idx].content
  const highlighted = hljs.highlightAuto(code).value
  return `<span inline-flex shadow relative rd-6px overflow-hidden break-all m-2px>
            <code class="hljs" !px-3px !py-0>${highlighted}</code></span>`
}

export default defineComponent({
  props: ['text', 'isUser'],
  setup(props, { expose }) {
    const elRef = ref<ElRef>()

    expose({
      elRef,
    })

    // onLongPress(
    //   elRef,
    //   longPressHandler,
    //   { modifiers: { prevent: true } },
    // )
    return () => {
      let { text, isUser } = props

      if (!text)
        return undefined

      if (isUser)
        return <div>{text}</div>

      const count = text.match(/```/g)?.length
      if (count >= 0 && count % 2 !== 0)
        text += '\n```'

      const mdTxt = mdi.render(text) || text

      return (
        <>
          <div ref={elRef} class={'mdbox'} innerHTML={mdTxt}></div>
        </>
      )
    }
  },
})
