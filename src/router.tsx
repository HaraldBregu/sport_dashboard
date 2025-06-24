import { createBrowserRouter } from 'react-router-dom'
import EditorPage from './pages/editor/page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <EditorPage />
  }
])
