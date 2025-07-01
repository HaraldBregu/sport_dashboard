import Content from './Content'
import Header from './Header'
import { SidebarLeft } from '@/pages/dashboard/SidebarLeft'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import Footer from './Footer'
import { EditorProvider } from './context'


const EditorPageProvider = ({ children }: { children: React.ReactNode }) => {
  return <EditorProvider>{children}</EditorProvider>
}

const EditorPageContent = () => {
  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        <div className="flex flex-col h-screen">
          <Header className="sticky top-0 z-10" />
          <div className="flex-1 overflow-auto">
            <Content placeholder="Start writing your content..." />
          </div>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function EditorPage() {
  console.log('EditorPage')

  return (
    <>
      <EditorPageProvider>
        <EditorPageContent />
      </EditorPageProvider>
    </>
  )
}

EditorPage.displayName = 'EditorPage'


