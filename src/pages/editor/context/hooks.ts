import { useContextSelector } from 'use-context-selector'
import { EditorContext } from './EditorContext'

// Custom hook to use the editor context
export function useEditor() {
    const context = useContextSelector(EditorContext, (context) => context)
    if (context === undefined) {
        throw new Error('useEditor must be used within an EditorProvider')
    }
    return context
}

// Custom hook to use only the editor state
export function useEditorState() {
    const state = useContextSelector(EditorContext, (context) => context?.state)
    if (state === undefined) {
        throw new Error('useEditorState must be used within an EditorProvider')
    }
    return state
}

// Custom hook to use only the editor dispatch
export function useEditorDispatch() {
    const dispatch = useContextSelector(EditorContext, (context) => context?.dispatch)
    if (dispatch === undefined) {
        throw new Error('useEditorDispatch must be used within an EditorProvider')
    }
    return dispatch
}

// Optimized hooks for specific state properties
export function useEditorTextFormatting() {
    const context = useContextSelector(EditorContext, (context) => context)
    if (context === undefined) {
        throw new Error('useEditorTextFormatting must be used within an EditorProvider')
    }
    return {
        isBold: context.state.isBold,
        isItalic: context.state.isItalic,
        isUnderline: context.state.isUnderline,
        isStrike: context.state.isStrike,
        isCode: context.state.isCode,
        isHighlight: context.state.isHighlight,
    }
}

export function useEditorTextAlignment() {
    const context = useContextSelector(EditorContext, (context) => context)
    if (context === undefined) {
        throw new Error('useEditorTextAlignment must be used within an EditorProvider')
    }
    return context.state.textAlign
}

export function useEditorLists() {
    const context = useContextSelector(EditorContext, (context) => context)
    if (context === undefined) {
        throw new Error('useEditorLists must be used within an EditorProvider')
    }
    return {
        isBulletList: context.state.isBulletList,
        isOrderedList: context.state.isOrderedList,
        isBlockquote: context.state.isBlockquote,
    }
}

export function useEditorHeading() {
    const context = useContextSelector(EditorContext, (context) => context)
    if (context === undefined) {
        throw new Error('useEditorHeading must be used within an EditorProvider')
    }
    return context.state.headingLevel
}

export function useEditorFont() {
    const context = useContextSelector(EditorContext, (context) => context)
    if (context === undefined) {
        throw new Error('useEditorFont must be used within an EditorProvider')
    }
    return {
        fontSize: context.state.fontSize,
        fontFamily: context.state.fontFamily,
    }
}

export function useEditorContent() {
    const context = useContextSelector(EditorContext, (context) => context)
    if (context === undefined) {
        throw new Error('useEditorContent must be used within an EditorProvider')
    }
    return context.state.content
}

export function useEditorSelection() {
    const context = useContextSelector(EditorContext, (context) => context)
    if (context === undefined) {
        throw new Error('useEditorSelection must be used within an EditorProvider')
    }
    return {
        hasSelection: context.state.hasSelection,
        selectionText: context.state.selectionText,
    }
}

export function useEditorContextBubble() {
    const context = useContextSelector(EditorContext, (context) => context)
    if (context === undefined) {
        throw new Error('useEditorContextBubble must be used within an EditorProvider')
    }
    return {
        contextBubble: context.state.contextBubble,
        selectionRect: context.state.selectionRect,
    }
}

export function useEditorHistory() {
    const context = useContextSelector(EditorContext, (context) => context)
    if (context === undefined) {
        throw new Error('useEditorHistory must be used within an EditorProvider')
    }
    return {
        canUndo: context.state.canUndo,
        canRedo: context.state.canRedo,
    }
}

export function useEditorDocumentState() {
    const context = useContextSelector(EditorContext, (context) => context)
    if (context === undefined) {
        throw new Error('useEditorDocumentState must be used within an EditorProvider')
    }
    return {
        isDirty: context.state.isDirty,
        isSaving: context.state.isSaving,
    }
}

// Hook for specific convenience methods
export function useEditorActions() {
    const context = useContextSelector(EditorContext, (context) => context)
    if (context === undefined) {
        throw new Error('useEditorActions must be used within an EditorProvider')
    }
    return {
        setBold: context.setBold,
        setItalic: context.setItalic,
        setUnderline: context.setUnderline,
        setStrike: context.setStrike,
        setCode: context.setCode,
        setHighlight: context.setHighlight,
        setTextAlign: context.setTextAlign,
        setLink: context.setLink,
        setBulletList: context.setBulletList,
        setOrderedList: context.setOrderedList,
        setBlockquote: context.setBlockquote,
        setHeadingLevel: context.setHeadingLevel,
        setFontSize: context.setFontSize,
        setFontFamily: context.setFontFamily,
        setContent: context.setContent,
        setSelection: context.setSelection,
        setContextBubble: context.setContextBubble,
        setSelectionRect: context.setSelectionRect,
        setUndoRedo: context.setUndoRedo,
        setDirty: context.setDirty,
        setSaving: context.setSaving,
        resetState: context.resetState,
        updateEditorState: context.updateEditorState,
    }
} 