import { Mark, mergeAttributes } from '@tiptap/core'

export interface Style {
  fontFamily?: string
  fontSize?: string
  fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number
  fontStyle?: 'normal' | 'italic' | 'oblique'
  textDecoration?: 'none' | 'underline' | 'line-through' | 'overline'
  color?: string
  backgroundColor?: string
  letterSpacing?: string
  lineHeight?: string | number
}

export interface StyleOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    style: {
      /**
       * Set a style mark
       */
      setStyle: (style: Style) => ReturnType
      /**
       * Unset a style mark
       */
      unsetStyle: () => ReturnType
      /**
       * Toggle a style mark
       */
      toggleStyle: (style: Style) => ReturnType
    }
  }
}

export const StyleMark = Mark.create<StyleOptions>({
  name: 'StyleMark',

  addOptions() {
    return {
      HTMLAttributes: {}
    }
  },

  addAttributes() {
    return {
      fontFamily: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-font-family'),
        renderHTML: (attributes) => {
          if (!attributes.fontFamily) {
            return {}
          }
          return {
            'data-font-family': attributes.fontFamily
          }
        }
      },
      fontSize: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-font-size'),
        renderHTML: (attributes) => {
          if (!attributes.fontSize) {
            return {}
          }
          return {
            'data-font-size': attributes.fontSize
          }
        }
      },
      fontWeight: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-font-weight'),
        renderHTML: (attributes) => {
          if (!attributes.fontWeight) {
            return {}
          }
          return {
            'data-font-weight': attributes.fontWeight
          }
        }
      },
      fontStyle: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-font-style'),
        renderHTML: (attributes) => {
          if (!attributes.fontStyle) {
            return {}
          }
          return {
            'data-font-style': attributes.fontStyle
          }
        }
      },
      textDecoration: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-text-decoration'),
        renderHTML: (attributes) => {
          if (!attributes.textDecoration) {
            return {}
          }
          return {
            'data-text-decoration': attributes.textDecoration
          }
        }
      },
      color: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-color'),
        renderHTML: (attributes) => {
          if (!attributes.color) {
            return {}
          }
          return {
            'data-color': attributes.color
          }
        }
      },
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-background-color'),
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {}
          }
          return {
            'data-background-color': attributes.backgroundColor
          }
        }
      },
      letterSpacing: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-letter-spacing'),
        renderHTML: (attributes) => {
          if (!attributes.letterSpacing) {
            return {}
          }
          return {
            'data-letter-spacing': attributes.letterSpacing
          }
        }
      },
      lineHeight: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-line-height'),
        renderHTML: (attributes) => {
          if (!attributes.lineHeight) {
            return {}
          }
          return {
            'data-line-height': attributes.lineHeight
          }
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-font-family]'
      },
      {
        tag: 'span[data-font-size]'
      },
      {
        tag: 'span[data-font-weight]'
      },
      {
        tag: 'span[data-font-style]'
      },
      {
        tag: 'span[data-text-decoration]'
      },
      {
        tag: 'span[data-color]'
      },
      {
        tag: 'span[data-background-color]'
      },
      {
        tag: 'span[data-letter-spacing]'
      },
      {
        tag: 'span[data-line-height]'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    // Build inline styles from attributes
    const style: Record<string, string> = {}
    
    if (HTMLAttributes.fontFamily) {
      style.fontFamily = HTMLAttributes.fontFamily
    }
    if (HTMLAttributes.fontSize) {
      style.fontSize = HTMLAttributes.fontSize
    }
    if (HTMLAttributes.fontWeight) {
      style.fontWeight = HTMLAttributes.fontWeight
    }
    if (HTMLAttributes.fontStyle) {
      style.fontStyle = HTMLAttributes.fontStyle
    }
    if (HTMLAttributes.textDecoration) {
      style.textDecoration = HTMLAttributes.textDecoration
    }
    if (HTMLAttributes.color) {
      style.color = HTMLAttributes.color
    }
    if (HTMLAttributes.backgroundColor) {
      style.backgroundColor = HTMLAttributes.backgroundColor
    }
    if (HTMLAttributes.letterSpacing) {
      style.letterSpacing = HTMLAttributes.letterSpacing
    }
    if (HTMLAttributes.lineHeight) {
      style.lineHeight = HTMLAttributes.lineHeight
    }

    const styleString = Object.entries(style)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
      .join('; ')

    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: 'style-mark',
        style: styleString
      }),
      0
    ]
  },

  addCommands() {
    return {
      setStyle:
        (style: Style) =>
        ({ commands }) => {
          return commands.setMark(this.name, style)
        },
      unsetStyle:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
      toggleStyle:
        (style: Style) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, style)
        }
    }
  }
})

export default StyleMark 