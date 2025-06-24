import { forwardRef } from 'react'
import TextEditor from '@/components/texteditor/text-editor'

const Content = forwardRef<HTMLDivElement>((props, ref) => {


  return (
    <div ref={ref} className="flex flex-1 flex-col">
      <TextEditor
        className="h-full w-full"
        content={''}
        onChange={() => {
        }}
        placeholder="Start writing your content..."
      />
    </div>
  )
})

Content.displayName = 'Content'

export default Content
