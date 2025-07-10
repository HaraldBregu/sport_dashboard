import { Mark, mergeAttributes } from '@tiptap/core'

export interface StyleOptions {
  HTMLAttributes: Record<string, unknown>
}

// Define the Style type for better type safety
export interface Style {
  bold?: boolean
  italic?: boolean
  fontSize?: string
  fontFamily?: string
  color?: string
  backgroundColor?: string
  textDecoration?: string
  textTransform?: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customStyle: {
      /**
       * Set custom style mark
       */
      setStyle: (style: Style) => ReturnType
      /**
       * Unset custom style mark
       */
      unsetStyle: () => ReturnType
      /**
       * Toggle custom style mark
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
      bold: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-bold') === 'true',
        renderHTML: (attributes) => {
          if (!attributes.bold) {
            return {}
          }
          return {
            'data-bold': 'true',
            style: 'font-weight: bold;'
          }
        }
      },
      italic: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-italic') === 'true',
        renderHTML: (attributes) => {
          if (!attributes.italic) {
            return {}
          }
          return {
            'data-italic': 'true',
            style: 'font-style: italic;'
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
            'data-font-size': attributes.fontSize,
            style: `font-size: ${attributes.fontSize};`
          }
        }
      },
      fontFamily: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-font-family'),
        renderHTML: (attributes) => {
          if (!attributes.fontFamily) {
            return {}
          }
          return {
            'data-font-family': attributes.fontFamily,
            style: `font-family: ${attributes.fontFamily};`
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
            'data-color': attributes.color,
            style: `color: ${attributes.color};`
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
            'data-background-color': attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor};`
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
            'data-text-decoration': attributes.textDecoration,
            style: `text-decoration: ${attributes.textDecoration};`
          }
        }
      },
      textTransform: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-text-transform'),
        renderHTML: (attributes) => {
          if (!attributes.textTransform) {
            return {}
          }
          return {
            'data-text-transform': attributes.textTransform,
            style: `text-transform: ${attributes.textTransform};`
          }
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-style]'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    // Combine all style attributes into a single style string
    const styles: string[] = []
    
    if (HTMLAttributes.bold) styles.push('font-weight: bold')
    if (HTMLAttributes.italic) styles.push('font-style: italic')
    if (HTMLAttributes.fontSize) styles.push(`font-size: ${HTMLAttributes.fontSize}`)
    if (HTMLAttributes.fontFamily) styles.push(`font-family: ${HTMLAttributes.fontFamily}`)
    if (HTMLAttributes.color) styles.push(`color: ${HTMLAttributes.color}`)
    if (HTMLAttributes.backgroundColor) styles.push(`background-color: ${HTMLAttributes.backgroundColor}`)
    if (HTMLAttributes.textDecoration) styles.push(`text-decoration: ${HTMLAttributes.textDecoration}`)
    if (HTMLAttributes.textTransform) styles.push(`text-transform: ${HTMLAttributes.textTransform}`)

    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-style': 'true',
        style: styles.join(';')
      }),
      0
    ]
  },

  addCommands() {
    return {
      setStyle:
        (style: Style = {}) =>
        ({ commands }) => {
          return commands.setMark(this.name, style)
        },
      unsetStyle:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
      toggleStyle:
        (style: Style = {}) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, style)
        }
    }
  }
})

export default StyleMark 