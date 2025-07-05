import { createBrowserRouter } from 'react-router-dom'
import EditorPage from './pages/editor/page'
import DemoPage from './pages/demo/page'
import FastContextPage from './pages/fast-context/page'
import DefaultContextPage from './pages/default-context/page'
import FastContextGenericPage from './pages/fast-context-generic/page'
import FastContextGenericExtendedPageExtended from './pages/fast-context-generic-extended/page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <EditorPage />
  },
  {
    path: '/demo',
    element: <DemoPage />
  },
  {
    path: '/default-context',
    element: <DefaultContextPage />
  },
  {
    path: '/fast-context',
    element: <FastContextPage />
  },
  {
    path: '/fast-context-generic',
    element: <FastContextGenericPage />
  },
  {
    path: '/fast-context-generic-extended',
    element: <FastContextGenericExtendedPageExtended />
  }
])
