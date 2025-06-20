import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string
}

const Header = ({ className }: HeaderProps) => {

  return (
    <header className={cn("bg-background sticky top-0 flex h-14 shrink-0 items-center gap-2", className)}>
      <div className="flex flex-1 items-center gap-2 px-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">
                Tiptap Editor
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}

Header.displayName = 'Header';

export default Header;