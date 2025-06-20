import { SidebarLeft } from '@/pages/dashboard/SidebarLeft'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import Header from './Header'
import { SidebarRight } from './SidebarRight'
import Footer from './Footer'

export default function AichatPage() {
  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        <Header />
        <Footer />
      </SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  )
}
