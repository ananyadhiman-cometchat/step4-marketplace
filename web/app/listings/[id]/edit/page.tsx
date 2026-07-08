'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { listingsApi, getErrorMessage } from '@/lib/api'
import { Navbar } from '@/components/Navbar'
import { ListingForm } from '@/components/ListingForm'
import { PageLoader } from '@/components/LoadingSpinner'
import { useToast } from '@/components/ToastProvider'
import type { Listing } from '@/types'

export default function EditListingPage() {
  const { isAuthenticated, user, hasRole } = useAuth()
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return }
    if (!hasRole('seller', 'admin')) { router.replace('/'); return }
  }, [isAuthenticated, hasRole, router])

  useEffect(() => {
    if (!isAuthenticated || !id) return
    listingsApi
      .get(id)
      .then(({ data }) => {
        if (data.seller_uid !== user?.uid && !hasRole('admin')) {
          toast('You can only edit your own listings', 'error')
          router.replace('/')
          return
        }
        setListing(data)
      })
      .catch((err) => {
        toast(getErrorMessage(err), 'error')
        router.replace('/')
      })
      .finally(() => setLoading(false))
  }, [isAuthenticated, id, user, hasRole, toast, router])

  if (!isAuthenticated || !hasRole('seller', 'admin')) return null
  if (loading) return <><Navbar /><PageLoader /></>
  if (!listing) return null

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit listing</h1>
        <div className="card p-6">
          <ListingForm initial={listing} listingId={listing.id} />
        </div>
      </main>
    </div>
  )
}
