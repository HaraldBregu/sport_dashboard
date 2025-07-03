import Content, { ContentRef } from './Content'
import Header from './Header'
import { SidebarLeft } from '@/pages/dashboard/SidebarLeft'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import Footer from './Footer'
import { EditorProvider } from './context'
import { useRef } from 'react'


const EditorPageProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <EditorProvider>
      {children}
    </EditorProvider>
  )
}

const EditorPageContent = () => {
  const contentRef = useRef<ContentRef>(null)

  return (
    <SidebarProvider defaultOpen={false}>
      <SidebarLeft />
      <SidebarInset>
        <div className="flex flex-col h-screen">
          <Header
            className="sticky top-0 z-10"
            onSetBold={() => {
              contentRef.current?.setBold()
            }}
          />
          <div className="flex-1 overflow-hidden">
            <Content
              placeholder="Start writing your content..."
              ref={contentRef}
            />
          </div>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
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


