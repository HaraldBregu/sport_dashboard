import { Mark, mergeAttributes } from '@tiptap/core'

export interface NoteOptions {
  HTMLAttributes: Record<string, unknown>
  defaultHighlightColor?: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    note: {
      /**
       * Set a note mark
       */
      setNote: (attributes?: {
        note?: string
        author?: string
        noteId?: string
        highlightColor?: string
      }) => ReturnType
      /**
       * Unset a note mark
       */
      unsetNote: () => ReturnType
      /**
       * Toggle a note mark
       */
      toggleNote: (attributes?: {
        note?: string
        author?: string
        noteId?: string
        highlightColor?: string
      }) => ReturnType
    }
  }
}

const NoteMark = Mark.create<NoteOptions>({
  name: 'NoteMark',

  inclusive: false,

  selectable: false,

  addOptions() {
    return {
      HTMLAttributes: {},
      defaultHighlightColor: '#E5F6FD'  // Light blue default color
    }
  },

  addAttributes() {
    return {
      note: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-note'),
        renderHTML: (attributes) => {
          if (!attributes.note) {
            return {}
          }
          return {
            'data-note': attributes.note
          }
        }
      },
      author: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-author'),
        renderHTML: (attributes) => {
          if (!attributes.author) {
            return {}
          }
          return {
            'data-author': attributes.author
          }
        }
      },
      noteId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-note-id'),
        renderHTML: (attributes) => {
          if (!attributes.noteId) {
            return {}
          }
          return {
            'data-note-id': attributes.noteId
          }
        }
      },
      highlightColor: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-highlight-color'),
        renderHTML: (attributes) => {
          if (!attributes.highlightColor) {
            return {}
          }
          return {
            'data-highlight-color': attributes.highlightColor
          }
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'note[data-note]'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const highlightColor = HTMLAttributes.highlightColor || this.options.defaultHighlightColor
    return [
      'note',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: 'note-mark cursor-pointer',
        title: HTMLAttributes.note || 'Note',
        style: `background-color: ${highlightColor};`
      }),
      0
    ]
  },

  addCommands() {
    return {
      setNote:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes)
        },
      unsetNote:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
      toggleNote:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, attributes)
        }
    }
  },

  
  // addNodeView() {
  //   return ({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) => {
  //     const dom = document.createElement("div");
  //     dom.classList.add("nunjucks-dom");
  //     const content = document.createElement("div");
  //     content.classList.add("content");
  //     content.setAttribute("contentEditable", "false");
  //     dom.append(content);
  //     if (!content.innerHTML.trim()) {
  //       const var_name = document.createElement("i");
  //       var_name.innerText = HTMLAttributes["data-var-name"] as string;
  //       content.appendChild(var_name);
  //     }

  //     return {
  //       dom,
  //       contentDOM: content,
  //     };
  //   };
  // },
})

export default NoteMark
