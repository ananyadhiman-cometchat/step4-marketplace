'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { listingsApi, getErrorMessage } from '@/lib/api'
import { Navbar } from '@/components/Navbar'
import { ListingImages } from '@/components/ListingImages'
import { ListingInfo } from '@/components/ListingInfo'
import { SellerCard } from '@/components/SellerCard'
import { ContactButton } from '@/components/ContactButton'
import { PageLoader } from '@/components/LoadingSpinner'
import { useToast } from '@/components/ToastProvider'
import type { Listing } from '@/types'

export default function ListingDetailPage() {
  const { isAuthenticated, user, hasRole } = useAuth()
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login')
  }, [isAuthenticated, router])

  useEffect(() => {
    if (!isAuthenticated || !id) return
    listingsApi
      .get(id)
      .then(({ data }) => setListing(data))
      .catch((err) => toast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false))
  }, [isAuthenticated, id, toast])

  if (!isAuthenticated) return null
  if (loading) return <><Navbar /><PageLoader /></>

  if (!listing) {
    return (
      <>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500">Listing not found.</p>
          <Link href="/" className="btn-primary mt-4 inline-block">Back to marketplace</Link>
        </main>
      </>
    )
  }

  const isOwner = user?.uid === listing.seller_uid
  const canEdit = isOwner || hasRole('admin')

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 group">
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to marketplace
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ListingImages images={listing.images} title={listing.title} />

          <div className="space-y-4">
            <ListingInfo listing={listing} />
            <SellerCard seller={listing.seller} />
            <ContactButton listingId={listing.id} sellerUid={listing.seller_uid} />

            {canEdit && (
              <div className="flex gap-2 pt-2">
                <Link href={`/listings/${listing.id}/edit`} className="btn-secondary flex-1 text-center">
                  Edit listing
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
