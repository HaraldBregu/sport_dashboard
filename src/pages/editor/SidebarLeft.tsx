import * as React from 'react'

import { SearchForm } from '@/components/search-form'
import { VersionSwitcher } from '@/components/version-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar'
import { SidebarOptInForm } from '@/components/sidebar-opt-in-form'
import { useTheme } from 'next-themes'

// This is sample data.
const data = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'Getting Started',
      url: '#',
      items: [
        {
          title: 'Installation',
          url: '#'
        },
        {
          title: 'Project Structure',
          url: '#'
        }
      ]
    },
    {
      title: 'Building Your Application',
      url: '#',
      items: [
        {
          title: 'Routing',
          url: '#'
        },
        {
          title: 'Data Fetching',
          url: '#',
          isActive: true
        },
        {
          title: 'Rendering',
          url: '#'
        },
        {
          title: 'Caching',
          url: '#'
        },
        {
          title: 'Styling',
          url: '#'
        },
        {
          title: 'Optimizing',
          url: '#'
        },
        {
          title: 'Configuring',
          url: '#'
        },
        {
          title: 'Testing',
          url: '#'
        },
        {
          title: 'Authentication',
          url: '#'
        },
        {
          title: 'Deploying',
          url: '#'
        },
        {
          title: 'Upgrading',
          url: '#'
        },
        {
          title: 'Examples',
          url: '#'
        }
      ]
    },
    {
      title: 'API Reference',
      url: '#',
      items: [
        {
          title: 'Components',
          url: '#'
        },
        {
          title: 'File Conventions',
          url: '#'
        },
        {
          title: 'Functions',
          url: '#'
        },
        {
          title: 'next.config.js Options',
          url: '#'
        },
        {
          title: 'CLI',
          url: '#'
        },
        {
          title: 'Edge Runtime',
          url: '#'
        }
      ]
    },
    {
      title: 'Architecture',
      url: '#',
      items: [
        {
          title: 'Accessibility',
          url: '#'
        },
        {
          title: 'Fast Refresh',
          url: '#'
        },
        {
          title: 'Next.js Compiler',
          url: '#'
        },
        {
          title: 'Supported Browsers',
          url: '#'
        },
        {
          title: 'Turbopack',
          url: '#'
        }
      ]
    }
  ]
}

export function SidebarLeft({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setTheme } = useTheme()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup>
          <SidebarGroupLabel>Theme</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => setTheme('light')}>
                  <a href="#">Light</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => setTheme('dark')}>
                  <a href="#">Dark</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => setTheme('system')}>
                  <a href="#">System</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-1">
          <SidebarOptInForm />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
