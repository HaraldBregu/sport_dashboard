import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { forwardRef } from 'react'

const Content = forwardRef<HTMLDivElement>((props, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing...'
      })
    ]
    // content: '<p>Hello World!</p>',
  })

  return (
    <div ref={ref} className="flex flex-1 flex-col">
      <EditorContent className="h-full w-full" editor={editor} />
    </div>
  )
})

Content.displayName = 'Content'

export default Content
