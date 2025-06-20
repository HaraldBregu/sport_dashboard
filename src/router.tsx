import { createBrowserRouter } from 'react-router-dom'
import RenderTest from './pages/render-test'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RenderTest />
  }
])
