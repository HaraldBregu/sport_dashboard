import TextEditorWithBubbleMenu from '@/components/texteditor/text-editor-with-bubble-menu'
import { testContent4 } from './data'

type ContentProps = {
  placeholder: string
}

const Content = ({ placeholder }: ContentProps) => {
 
 
  return (
    <>
      <TextEditorWithBubbleMenu
        placeholder={placeholder}
        className="h-full w-full"
        content={testContent4}
      />
    </>
  )
}

export default Content