'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/Navbar'
import { ListingForm } from '@/components/ListingForm'

export default function CreateListingPage() {
  const { isAuthenticated, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return }
    if (!hasRole('seller', 'admin')) router.replace('/')
  }, [isAuthenticated, hasRole, router])

  if (!isAuthenticated || !hasRole('seller', 'admin')) return null

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a new listing</h1>
        <div className="card p-6">
          <ListingForm />
        </div>
      </main>
    </div>
  )
}
