import { Link } from 'react-router-dom'

const routes = [
  { path: '/', label: 'Sitemap' },
  { path: '/editor', label: 'Editor' },
  { path: '/demo', label: 'Demo' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/aichat', label: 'AI Chat' },
  { path: '/default-context', label: 'Default Context' },
  { path: '/fast-context', label: 'Fast Context' },
  { path: '/fast-context-generic', label: 'Fast Context Generic' },
  { path: '/fast-context-generic-extended', label: 'Fast Context Generic Extended' }
]

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Site Navigation</h1>
        <div className="bg-white shadow rounded-lg">
          <ul className="divide-y divide-gray-200">
            {routes.map((route) => (
              <li key={route.path}>
                <Link
                  to={route.path}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-gray-900">{route.label}</span>
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
