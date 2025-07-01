# Editor Context with use-context-selector

This editor context has been optimized using the `use-context-selector` package to prevent unnecessary re-renders.

## Benefits

- **Selective subscriptions**: Components only re-render when the specific parts of state they use change
- **Performance optimization**: Reduces unnecessary re-renders in large component trees
- **Type safety**: Full TypeScript support with proper error handling

## Available Hooks

### Basic Hooks
- `useEditor()` - Get the full context (state + actions)
- `useEditorState()` - Get only the state
- `useEditorDispatch()` - Get only the dispatch function

### Optimized State Hooks
- `useEditorTextFormatting()` - Text formatting state (bold, italic, etc.)
- `useEditorTextAlignment()` - Text alignment state
- `useEditorLists()` - List formatting state (bullet, ordered, blockquote)
- `useEditorHeading()` - Heading level state
- `useEditorFont()` - Font settings (size, family)
- `useEditorContent()` - Editor content
- `useEditorSelection()` - Selection state
- `useEditorContextBubble()` - Context bubble state
- `useEditorHistory()` - Undo/redo state
- `useEditorDocumentState()` - Document state (dirty, saving)

### Optimized Action Hooks
- `useEditorActions()` - All editor actions

## Usage Examples

### Using Optimized Hooks (Recommended)
```tsx
// Only re-renders when text formatting changes
const { isBold, isItalic } = useEditorTextFormatting()

// Only re-renders when font changes
const { fontSize, fontFamily } = useEditorFont()

// Only re-renders when actions are called
const { setBold, setItalic } = useEditorActions()
```

### Using Basic Hooks
```tsx
// Re-renders on any state change
const { state, setBold } = useEditor()
const { isBold } = state
```

## Error Handling

All hooks throw descriptive errors if used outside of the `EditorProvider`:

```tsx
// This will throw: "useEditorTextFormatting must be used within an EditorProvider"
const formatting = useEditorTextFormatting()
```

## Performance Comparison

- **Before**: Any state change caused all components using `useEditor()` to re-render
- **After**: Components only re-render when their specific state dependencies change

Example:
- A toolbar button using `useEditorTextFormatting()` will only re-render when text formatting changes
- A font selector using `useEditorFont()` will only re-render when font settings change
- Both components can coexist without affecting each other's performance

## Files

- `EditorContext.tsx` - Main context implementation with provider, reducer, and hooks
- `editorUtils.ts` - Utility functions for working with editor state
- `index.ts` - Export file for easy imports
- `README.md` - This documentation file

## Features

### State Management
- **Text Formatting**: Bold, italic, underline, strikethrough, code, highlight
- **Text Alignment**: Left, center, right, justify
- **Structural Elements**: Headings (H1-H6), bullet lists, ordered lists, blockquotes
- **Font Settings**: Font family, font size
- **Links**: Link state management
- **Selection**: Text selection state and content
- **Context Bubble**: Floating toolbar position and selection rectangle
- **History**: Undo/redo state
- **Document State**: Dirty state, saving state

### Hooks
- `useEditor()` - Main hook providing state and dispatch
- `useEditorState()` - Hook for accessing only the state
- `useEditorDispatch()` - Hook for accessing only the dispatch function

### Utility Functions
- State validation and formatting helpers
- Display name generators for UI elements
- State comparison and diff utilities
- Clean state creation for persistence

## Usage

### Basic Setup

Wrap your editor components with the `EditorProvider`:

```tsx
import { EditorProvider } from '@/pages/editor/context'

function EditorPage() {
  return (
    <EditorProvider>
      <EditorContent />
      <EditorToolbar />
    </EditorProvider>
  )
}
```

### Using the Context in Components

```tsx
import { useEditor, useEditorState } from '@/pages/editor/context'

function EditorToolbar() {
  const { state, setBold, setItalic, setFontSize } = useEditor()
  
  return (
    <div>
      <button 
        onClick={() => setBold(!state.isBold)}
        className={state.isBold ? 'active' : ''}
      >
        Bold
      </button>
      
      <button 
        onClick={() => setItalic(!state.isItalic)}
        className={state.isItalic ? 'active' : ''}
      >
        Italic
      </button>
      
      <select 
        value={state.fontSize}
        onChange={(e) => setFontSize(Number(e.target.value))}
      >
        <option value={12}>12px</option>
        <option value={16}>16px</option>
        <option value={20}>20px</option>
      </select>
    </div>
  )
}
```

### Using Only State or Dispatch

```tsx
import { useEditorState, useEditorDispatch } from '@/pages/editor/context'

function EditorStatus() {
  const state = useEditorState()
  const dispatch = useEditorDispatch()
  
  return (
    <div>
      <p>Current font: {state.fontFamily} {state.fontSize}px</p>
      <p>Can undo: {state.canUndo ? 'Yes' : 'No'}</p>
      <p>Document dirty: {state.isDirty ? 'Yes' : 'No'}</p>
    </div>
  )
}
```

### Using Utility Functions

```tsx
import { 
  hasActiveFormatting, 
  getEditorStateSummary,
  getHeadingDisplayName 
} from '@/pages/editor/context'

function EditorDebug() {
  const { state } = useEditor()
  
  return (
    <div>
      <p>Has formatting: {hasActiveFormatting(state) ? 'Yes' : 'No'}</p>
      <p>Current heading: {getHeadingDisplayName(state.headingLevel)}</p>
      <p>State summary: {getEditorStateSummary(state)}</p>
    </div>
  )
}
```

### Custom Initial State

```tsx
import { EditorProvider } from '@/pages/editor/context'

function EditorPage() {
  const initialState = {
    fontSize: 18,
    fontFamily: 'arial',
    content: '<p>Initial content</p>',
  }
  
  return (
    <EditorProvider initialState={initialState}>
      <EditorContent />
    </EditorProvider>
  )
}
```

## State Structure

```typescript
interface EditorState {
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
```

## Best Practices

### 1. Use Convenience Methods
Instead of dispatching actions directly, use the provided convenience methods:

```tsx
// Good
const { setBold, setFontSize } = useEditor()
setBold(true)
setFontSize(18)

// Avoid
const { dispatch } = useEditor()
dispatch({ type: 'SET_BOLD', payload: true })
dispatch({ type: 'SET_FONT_SIZE', payload: 18 })
```

### 2. Optimize Re-renders
Use specific hooks when you only need part of the context:

```tsx
// Good - only re-renders when state changes
const state = useEditorState()

// Good - only re-renders when dispatch changes
const dispatch = useEditorDispatch()

// Avoid - re-renders on any context change
const { state, dispatch } = useEditor()
```

### 3. Validate State Updates
Use utility functions to validate state before updates:

```tsx
import { isValidFontSize } from '@/pages/editor/context'

function FontSizeSelector() {
  const { state, setFontSize } = useEditor()
  
  const handleFontSizeChange = (size: number) => {
    if (isValidFontSize(size)) {
      setFontSize(size)
    }
  }
  
  return (
    <input 
      type="number"
      value={state.fontSize}
      onChange={(e) => handleFontSizeChange(Number(e.target.value))}
      min={8}
      max={72}
    />
  )
}
```

### 4. Handle Async Operations
Use the saving state for async operations:

```tsx
function SaveButton() {
  const { state, setSaving, setDirty } = useEditor()
  
  const handleSave = async () => {
    setSaving(true)
    try {
      await saveContent(state.content)
      setDirty(false)
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setSaving(false)
    }
  }
  
  return (
    <button 
      onClick={handleSave}
      disabled={state.isSaving || !state.isDirty}
    >
      {state.isSaving ? 'Saving...' : 'Save'}
    </button>
  )
}
```

## Integration with Tiptap

The context is designed to work seamlessly with Tiptap editor. Here's how to sync the editor state:

```tsx
import { useEditor } from '@/pages/editor/context'
import { useEditor as useTiptapEditor } from '@tiptap/react'

function EditorComponent() {
  const { state, updateEditorState } = useEditor()
  const tiptapEditor = useTiptapEditor()
  
  useEffect(() => {
    if (!tiptapEditor) return
    
    const updateState = () => {
      updateEditorState({
        isBold: tiptapEditor.isActive('bold'),
        isItalic: tiptapEditor.isActive('italic'),
        isUnderline: tiptapEditor.isActive('underline'),
        // ... other state updates
      })
    }
    
    tiptapEditor.on('selectionUpdate', updateState)
    tiptapEditor.on('update', updateState)
    
    return () => {
      tiptapEditor.off('selectionUpdate', updateState)
      tiptapEditor.off('update', updateState)
    }
  }, [tiptapEditor, updateEditorState])
  
  return <EditorContent editor={tiptapEditor} />
}
```

## Performance Considerations

1. **Memoization**: The context uses `useCallback` for all convenience methods to prevent unnecessary re-renders
2. **Selective Updates**: Use specific hooks (`useEditorState`, `useEditorDispatch`) to minimize re-renders
3. **State Batching**: Multiple state updates are batched automatically by React's reducer pattern
4. **Cleanup**: The context automatically cleans up event listeners and subscriptions

## Testing

The context can be easily tested by providing a mock provider:

```tsx
import { render } from '@testing-library/react'
import { EditorProvider } from '@/pages/editor/context'

function renderWithEditorContext(ui: React.ReactElement, initialState = {}) {
  return render(
    <EditorProvider initialState={initialState}>
      {ui}
    </EditorProvider>
  )
}

test('should update bold state', () => {
  const { getByText } = renderWithEditorContext(<BoldButton />)
  const button = getByText('Bold')
  
  fireEvent.click(button)
  // Assert state changes
}) 