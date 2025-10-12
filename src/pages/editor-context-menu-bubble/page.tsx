import Content from './Content'
import { EditorProvider } from './context'

const EditorPageProvider = ({ children }: { children: React.ReactNode }) => {
  return <EditorProvider>{children}</EditorProvider>
}

const EditorPageContent = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          <div className="flex-1">
            <Content placeholder="Start writing your content..."/>
          </div>
          <div className="w-8"></div>
          <div className="flex-1">
            <Content placeholder="Start writing your content..."/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EditorPage() {
  return (
    <>
      <EditorPageProvider>
        <EditorPageContent />
      </EditorPageProvider>
    </>
  )
}

EditorPage.displayName = 'EditorPage'
