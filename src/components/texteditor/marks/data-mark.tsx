import { Mark, mergeAttributes } from '@tiptap/core'

export interface DataMarkOptions {
  HTMLAttributes: Record<string, unknown>
}

// Define the Style type similar to StyleMark
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
    dataMark: {
      /**
       * Set data mark with id, type and styles
       */
      setDataMark: (id: string, type: string, style?: Style) => ReturnType
      /**
       * Unset data mark
       */
      unsetDataMark: () => ReturnType
      /**
       * Toggle data mark
       */
      toggleDataMark: (id: string, type: string, style?: Style) => ReturnType
    }
  }
}

export const DataMark = Mark.create<DataMarkOptions>({
  name: 'DataMark',

  addOptions() {
    return {
      HTMLAttributes: {}
    }
  },

  addAttributes() {
    return {
      id: {
        default: "lhbdlfjhbdshf",
        parseHTML: (element) => element.getAttribute('data-id'),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {}
          }
          return {
            'data-id': attributes.id
          }
        }
      },
      type: {
        default: "BOOKMARK",
        parseHTML: (element) => element.getAttribute('data-type'),
        renderHTML: (attributes) => {
          if (!attributes.type) {
            return {}
          }
          return {
            'data-type': attributes.type
          }
        }
      },
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
        tag: 'span[data-mark]'
      },
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

      const dataAttributes = {
        'data-mark': 'true',
        'data-id': HTMLAttributes.id || '',
        'data-type': HTMLAttributes.type || '',
        'data-bold': HTMLAttributes.bold ? 'true' : undefined,
        'data-italic': HTMLAttributes.italic ? 'true' : undefined,
        'data-font-size': HTMLAttributes.fontSize,
        'data-font-family': HTMLAttributes.fontFamily,
        'data-color': HTMLAttributes.color,
        'data-background-color': HTMLAttributes.backgroundColor,
        'data-text-decoration': HTMLAttributes.textDecoration,
        'data-text-transform': HTMLAttributes.textTransform,
        style: styles.join(';')
      }
  
    return [
      'span',
      // mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, dataAttributes),

      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        ...dataAttributes,
        // 'data-mark': 'true',
        // style: styles.join(';')
      }),
      0
    ]
  },

  addCommands() {
    return {
      setDataMark:
        (id: string, type: string, style: Style = {}) =>
        ({ commands }) => {
          return commands.setMark(this.name, { id, type, ...style })
        },
      unsetDataMark:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
      toggleDataMark:
        (id: string, type: string, style: Style = {}) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, { id, type, ...style })
        }
    }
  }
})

export default DataMark 