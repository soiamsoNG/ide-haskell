import highlight = require('atom-highlight')

export interface IMessageText {
  text: string
  highlighter?: string
}

export interface IMessageHTML {
  html: string
}

function isTextMessage (msg: TMessage): msg is IMessageText {
  return !!(msg && (msg as IMessageText).text)
}

function isHTMLMessage (msg: TMessage): msg is IMessageHTML {
  return !!(msg && (msg as IMessageHTML).html)
}
export type TMessage = string | IMessageText | IMessageHTML | MessageObject

export class MessageObject {
  public static fromObject (message: TMessage): MessageObject  {
    if (message instanceof MessageObject) {
      return message
    } else {
      return new MessageObject(message)
    }
  }

  private htmlCache?: string
  constructor (private msg: string | IMessageText | IMessageHTML) {
    // noop
  }

  public toHtml (linter: boolean = false): string {
    if (this.htmlCache !== undefined) { return this.htmlCache }
    if (isTextMessage(this.msg) && this.msg.highlighter) {
      const html = highlight({
        fileContents: this.msg.text,
        scopeName: this.msg.highlighter,
        nbsp: linter,
        lineDivs: linter,
      })
      if (html) { return this.htmlCache = html }

      this.msg.highlighter = undefined
      return this.toHtml()
    } else if (isHTMLMessage(this.msg)) {
      return this.htmlCache = this.msg.html
    } else {
      let text: string
      if (isTextMessage(this.msg)) {
        text = this.msg.text
      } else {
        text = this.msg
      }
      const div = document.createElement('div')
      div.innerText = text
      return this.htmlCache = div.innerHTML
    }
  }

  public raw () {
    if (isTextMessage(this.msg)) {
      return this.msg.text
    } else {
      return this.msg
    }
  }
}
