import { createBrowserRouter } from 'react-router-dom'
import EditorPage from './pages/apparatus-editor/page'
// import DemoPage from './pages/demo/page'
// import FastContextPage from './pages/fast-context/page'
// import DefaultContextPage from './pages/default-context/page'
// import FastContextGenericPage from './pages/fast-context-generic/page'
// import FastContextGenericExtendedPageExtended from './pages/fast-context-generic-extended/page'
// import DashboardPage from './pages/dashboard/page'
// import AichatPage from './pages/aichat/page'
// import SitemapPage from './pages/sitemap/page'

export const router = createBrowserRouter([
  {
    path: "/",
    element: <EditorPage />
  },
  // {
  //   path: '/',
  //   element: <SitemapPage />
  // },
  // {
  //   path: "editor",
  //   element: <EditorPage />
  // },
  // {
  //   path: '/demo',
  //   element: <DemoPage />
  // },
  // {
  //   path: '/dashboard',
  //   element: <DashboardPage />
  // },
  // {
  //   path: '/aichat',
  //   element: <AichatPage />
  // },
  // {
  //   path: '/default-context',
  //   element: <DefaultContextPage />
  // },
  // {
  //   path: '/fast-context',
  //   element: <FastContextPage />
  // },
  // {
  //   path: '/fast-context-generic',
  //   element: <FastContextGenericPage />
  // },
  // {
  //   path: '/fast-context-generic-extended',
  //   element: <FastContextGenericExtendedPageExtended />
  // }
])
