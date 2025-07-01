import React, { useReducer, ReactNode, useCallback } from 'react'
import { createContext, useContextSelector } from 'use-context-selector'
import { EditorState, EditorAction } from './types'

// Initial state
const initialState: EditorState = {
    // Text formatting
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrike: false,
    isCode: false,
    isHighlight: false,

    // Text alignment
    textAlign: 'left',

    // Links and lists
    isLink: false,
    isBulletList: false,
    isOrderedList: false,
    isBlockquote: false,

    // Headings
    headingLevel: 0,

    // Font settings
    fontSize: 16,
    fontFamily: 'inter',

    // Editor content
    content: '',

    // Selection state
    hasSelection: false,
    selectionText: '',

    // Context bubble state
    contextBubble: null,
    selectionRect: null,

    // Editor history
    canUndo: false,
    canRedo: false,

    // Document state
    isDirty: false,
    isSaving: false,
}

// Reducer function
function editorReducer(state: EditorState, action: EditorAction): EditorState {
    switch (action.type) {
        case 'SET_BOLD':
            return { ...state, isBold: action.payload }
        case 'SET_ITALIC':
            return { ...state, isItalic: action.payload }
        case 'SET_UNDERLINE':
            return { ...state, isUnderline: action.payload }
        case 'SET_STRIKE':
            return { ...state, isStrike: action.payload }
        case 'SET_CODE':
            return { ...state, isCode: action.payload }
        case 'SET_HIGHLIGHT':
            return { ...state, isHighlight: action.payload }
        case 'SET_TEXT_ALIGN':
            return { ...state, textAlign: action.payload }
        case 'SET_LINK':
            return { ...state, isLink: action.payload }
        case 'SET_BULLET_LIST':
            return { ...state, isBulletList: action.payload }
        case 'SET_ORDERED_LIST':
            return { ...state, isOrderedList: action.payload }
        case 'SET_BLOCKQUOTE':
            return { ...state, isBlockquote: action.payload }
        case 'SET_HEADING_LEVEL':
            return { ...state, headingLevel: action.payload }
        case 'SET_FONT_SIZE':
            return { ...state, fontSize: action.payload }
        case 'SET_FONT_FAMILY':
            return { ...state, fontFamily: action.payload }
        case 'SET_CONTENT':
            return { ...state, content: action.payload, isDirty: true }
        case 'SET_SELECTION':
            return {
                ...state,
                hasSelection: action.payload.hasSelection,
                selectionText: action.payload.selectionText
            }
        case 'SET_CONTEXT_BUBBLE':
            return { ...state, contextBubble: action.payload }
        case 'SET_SELECTION_RECT':
            return { ...state, selectionRect: action.payload }
        case 'SET_UNDO_REDO':
            return {
                ...state,
                canUndo: action.payload.canUndo,
                canRedo: action.payload.canRedo
            }
        case 'SET_DIRTY':
            return { ...state, isDirty: action.payload }
        case 'SET_SAVING':
            return { ...state, isSaving: action.payload }
        case 'RESET_STATE':
            return initialState
        case 'UPDATE_EDITOR_STATE':
            return { ...state, ...action.payload }
        default:
            return state
    }
}

// Context interface
interface EditorContextType {
    state: EditorState
    dispatch: React.Dispatch<EditorAction>
    // Convenience methods
    setBold: (isBold: boolean) => void
    setItalic: (isItalic: boolean) => void
    setUnderline: (isUnderline: boolean) => void
    setStrike: (isStrike: boolean) => void
    setCode: (isCode: boolean) => void
    setHighlight: (isHighlight: boolean) => void
    setTextAlign: (textAlign: 'left' | 'center' | 'right' | 'justify') => void
    setLink: (isLink: boolean) => void
    setBulletList: (isBulletList: boolean) => void
    setOrderedList: (isOrderedList: boolean) => void
    setBlockquote: (isBlockquote: boolean) => void
    setHeadingLevel: (headingLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void
    setFontSize: (fontSize: number) => void
    setFontFamily: (fontFamily: string) => void
    setContent: (content: string) => void
    setSelection: (hasSelection: boolean, selectionText: string) => void
    setContextBubble: (position: { x: number; y: number } | null) => void
    setSelectionRect: (rect: DOMRect | null) => void
    setUndoRedo: (canUndo: boolean, canRedo: boolean) => void
    setDirty: (isDirty: boolean) => void
    setSaving: (isSaving: boolean) => void
    resetState: () => void
    updateEditorState: (updates: Partial<EditorState>) => void
}

// Create context
const EditorContext = createContext<EditorContextType | undefined>(undefined)

// Provider component
interface EditorProviderProps {
    children: ReactNode
    initialState?: Partial<EditorState>
}

export function EditorProvider({ children, initialState: customInitialState }: EditorProviderProps) {
    const [state, dispatch] = useReducer(editorReducer, {
        ...initialState,
        ...customInitialState,
    })

    // Convenience methods
    const setBold = useCallback((isBold: boolean) => {
        dispatch({ type: 'SET_BOLD', payload: isBold })
    }, [])

    const setItalic = useCallback((isItalic: boolean) => {
        dispatch({ type: 'SET_ITALIC', payload: isItalic })
    }, [])

    const setUnderline = useCallback((isUnderline: boolean) => {
        dispatch({ type: 'SET_UNDERLINE', payload: isUnderline })
    }, [])

    const setStrike = useCallback((isStrike: boolean) => {
        dispatch({ type: 'SET_STRIKE', payload: isStrike })
    }, [])

    const setCode = useCallback((isCode: boolean) => {
        dispatch({ type: 'SET_CODE', payload: isCode })
    }, [])

    const setHighlight = useCallback((isHighlight: boolean) => {
        dispatch({ type: 'SET_HIGHLIGHT', payload: isHighlight })
    }, [])

    const setTextAlign = useCallback((textAlign: 'left' | 'center' | 'right' | 'justify') => {
        dispatch({ type: 'SET_TEXT_ALIGN', payload: textAlign })
    }, [])

    const setLink = useCallback((isLink: boolean) => {
        dispatch({ type: 'SET_LINK', payload: isLink })
    }, [])

    const setBulletList = useCallback((isBulletList: boolean) => {
        dispatch({ type: 'SET_BULLET_LIST', payload: isBulletList })
    }, [])

    const setOrderedList = useCallback((isOrderedList: boolean) => {
        dispatch({ type: 'SET_ORDERED_LIST', payload: isOrderedList })
    }, [])

    const setBlockquote = useCallback((isBlockquote: boolean) => {
        dispatch({ type: 'SET_BLOCKQUOTE', payload: isBlockquote })
    }, [])

    const setHeadingLevel = useCallback((headingLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
        dispatch({ type: 'SET_HEADING_LEVEL', payload: headingLevel })
    }, [])

    const setFontSize = useCallback((fontSize: number) => {
        dispatch({ type: 'SET_FONT_SIZE', payload: fontSize })
    }, [])

    const setFontFamily = useCallback((fontFamily: string) => {
        dispatch({ type: 'SET_FONT_FAMILY', payload: fontFamily })
    }, [])

    const setContent = useCallback((content: string) => {
        dispatch({ type: 'SET_CONTENT', payload: content })
    }, [])

    const setSelection = useCallback((hasSelection: boolean, selectionText: string) => {
        dispatch({ type: 'SET_SELECTION', payload: { hasSelection, selectionText } })
    }, [])

    const setContextBubble = useCallback((position: { x: number; y: number } | null) => {
        dispatch({ type: 'SET_CONTEXT_BUBBLE', payload: position })
    }, [])

    const setSelectionRect = useCallback((rect: DOMRect | null) => {
        dispatch({ type: 'SET_SELECTION_RECT', payload: rect })
    }, [])

    const setUndoRedo = useCallback((canUndo: boolean, canRedo: boolean) => {
        dispatch({ type: 'SET_UNDO_REDO', payload: { canUndo, canRedo } })
    }, [])

    const setDirty = useCallback((isDirty: boolean) => {
        dispatch({ type: 'SET_DIRTY', payload: isDirty })
    }, [])

    const setSaving = useCallback((isSaving: boolean) => {
        dispatch({ type: 'SET_SAVING', payload: isSaving })
    }, [])

    const resetState = useCallback(() => {
        dispatch({ type: 'RESET_STATE' })
    }, [])

    const updateEditorState = useCallback((updates: Partial<EditorState>) => {
        dispatch({ type: 'UPDATE_EDITOR_STATE', payload: updates })
    }, [])

    const value: EditorContextType = {
        state,
        dispatch,
        setBold,
        setItalic,
        setUnderline,
        setStrike,
        setCode,
        setHighlight,
        setTextAlign,
        setLink,
        setBulletList,
        setOrderedList,
        setBlockquote,
        setHeadingLevel,
        setFontSize,
        setFontFamily,
        setContent,
        setSelection,
        setContextBubble,
        setSelectionRect,
        setUndoRedo,
        setDirty,
        setSaving,
        resetState,
        updateEditorState,
    }

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    )
}

// Export the context for use in hooks
export { EditorContext } 