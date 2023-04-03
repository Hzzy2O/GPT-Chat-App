class CopyablePre extends HTMLElement {
  private code: Nullable<HTMLPreElement> = null
  private copyButton: Nullable<HTMLSpanElement> = null

  constructor() {
    super()
  }

  connectedCallback() {
    // get the text content of the element
    this.code = this.querySelector('pre code')
    this.copyButton = this.querySelector('pre label')
    this.copyButton?.addEventListener('click', this.onCopyButtonClick.bind(this))
  }

  disconnectedCallback() {
    // remove the event listener when the element is removed from the DOM
    this.copyButton?.removeEventListener('click', this.onCopyButtonClick.bind(this))
  }

  onCopyButtonClick() {
    // copy the text content to the clipboard
    navigator.clipboard.writeText(this.code?.innerText || '')
    if (this.copyButton) {
      const cache = this.copyButton.innerHTML
      this.copyButton.innerHTML = 'copied!'

      setTimeout(() => {
        if (this.copyButton)
          this.copyButton.innerHTML = cache
      }, 1500)
    }
  }
}

export function registerCopyable() {
  if (!customElements.get('copyable-pre'))
    customElements.define('copyable-pre', CopyablePre)
}
