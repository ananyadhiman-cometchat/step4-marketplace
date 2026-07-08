'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LogoHeader } from '@/components/LogoHeader'
import { LoginForm } from '@/components/LoginForm'

export default function LoginPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) router.replace('/')
  }, [isAuthenticated, router])

  if (isAuthenticated) return null

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white px-4">
      <div className="w-full max-w-md">
        <LogoHeader />
        <div className="card p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">Sign in to your account</h2>
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
