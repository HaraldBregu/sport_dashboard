import { Button } from "../../components/ui/button"
import { Save, Eye, Settings, Send } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative mt-auto flex min-h-12 w-full items-center justify-between px-4 py-2 border-t ">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Save className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
        <Button size="sm">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </footer>
  )
}
