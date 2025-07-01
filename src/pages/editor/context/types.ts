// Types for editor state
export interface EditorState {
    // Text formatting
    isBold: boolean
    isItalic: boolean
    isUnderline: boolean
    isStrike: boolean
    isCode: boolean
    isHighlight: boolean

    // Text alignment
    textAlign: 'left' | 'center' | 'right' | 'justify'

    // Links and lists
    isLink: boolean
    isBulletList: boolean
    isOrderedList: boolean
    isBlockquote: boolean

    // Headings
    headingLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6

    // Font settings
    fontSize: number
    fontFamily: string

    // Editor content
    content: string

    // Selection state
    hasSelection: boolean
    selectionText: string

    // Context bubble state
    contextBubble: { x: number; y: number } | null
    selectionRect: DOMRect | null

    // Editor history
    canUndo: boolean
    canRedo: boolean

    // Document state
    isDirty: boolean
    isSaving: boolean
}

// Action types for the reducer
export type EditorAction =
    | { type: 'SET_BOLD'; payload: boolean }
    | { type: 'SET_ITALIC'; payload: boolean }
    | { type: 'SET_UNDERLINE'; payload: boolean }
    | { type: 'SET_STRIKE'; payload: boolean }
    | { type: 'SET_CODE'; payload: boolean }
    | { type: 'SET_HIGHLIGHT'; payload: boolean }
    | { type: 'SET_TEXT_ALIGN'; payload: 'left' | 'center' | 'right' | 'justify' }
    | { type: 'SET_LINK'; payload: boolean }
    | { type: 'SET_BULLET_LIST'; payload: boolean }
    | { type: 'SET_ORDERED_LIST'; payload: boolean }
    | { type: 'SET_BLOCKQUOTE'; payload: boolean }
    | { type: 'SET_HEADING_LEVEL'; payload: 0 | 1 | 2 | 3 | 4 | 5 | 6 }
    | { type: 'SET_FONT_SIZE'; payload: number }
    | { type: 'SET_FONT_FAMILY'; payload: string }
    | { type: 'SET_CONTENT'; payload: string }
    | { type: 'SET_SELECTION'; payload: { hasSelection: boolean; selectionText: string } }
    | { type: 'SET_CONTEXT_BUBBLE'; payload: { x: number; y: number } | null }
    | { type: 'SET_SELECTION_RECT'; payload: DOMRect | null }
    | { type: 'SET_UNDO_REDO'; payload: { canUndo: boolean; canRedo: boolean } }
    | { type: 'SET_DIRTY'; payload: boolean }
    | { type: 'SET_SAVING'; payload: boolean }
    | { type: 'RESET_STATE' }
    | { type: 'UPDATE_EDITOR_STATE'; payload: Partial<EditorState> } 