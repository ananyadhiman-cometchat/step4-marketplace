'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export function Navbar() {
  const { user, signOut, hasRole } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    signOut()
    router.push('/login')
  }

  const navLink = (href: string, label: string, testId?: string) => {
    const active = pathname === href || (href !== '/' && pathname.startsWith(href))
    return (
      <Link
        href={href}
        data-testid={testId}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          active
            ? 'bg-primary-100 text-primary-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        {label}
      </Link>
    )
  }

  if (!user) return null

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-1">
            <Link href="/" className="flex items-center gap-2 mr-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-lg hidden sm:block">Marketplace</span>
            </Link>

            {navLink('/', 'Browse')}
            {navLink('/conversations', 'Messages', 'nav-conversations')}
            {hasRole('seller', 'admin') && navLink('/listings/new', 'Sell')}
            {hasRole('admin', 'moderator') && navLink('/admin/moderation', 'Moderation')}
            {hasRole('admin') && navLink('/admin/users', 'Users')}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-900 px-3 py-1 rounded border border-gray-200 hover:border-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
