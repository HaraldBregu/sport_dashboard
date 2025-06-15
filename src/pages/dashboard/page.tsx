import { SidebarLeft } from "@/pages/dashboard/SidebarLeft"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import Header from "./Header"
import Content from "./Content"
import { SidebarRight } from "./SidebarRight"

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        <Header />
        <Content />
      </SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  )
}
