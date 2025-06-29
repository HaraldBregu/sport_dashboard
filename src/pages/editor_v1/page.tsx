import Content from './Content'
import Header from './Header'
import Toolbar from './Toolbar'
import { SidebarLeft } from '@/pages/dashboard/SidebarLeft'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import Footer from './Footer'

export default function EditorPage() {
  return (
    <>
      <SidebarProvider>
        <SidebarLeft />
        <SidebarInset>
          <div className="flex flex-col h-screen">
            <Header />
            <Toolbar />
            <Content placeholder="Start writing your content..." />
            <Footer />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}

EditorPage.displayName = 'EditorPage'
