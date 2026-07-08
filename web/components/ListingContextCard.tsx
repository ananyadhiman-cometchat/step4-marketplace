import Link from 'next/link'
import type { Listing } from '@/types'

interface Props {
  listing: Listing | null
}

export function ListingContextCard({ listing }: Props) {
  if (!listing) return null

  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: listing.currency ?? 'USD',
  }).format(listing.price)

  return (
    <Link href={`/listings/${listing.id}`} className="block card hover:shadow-md transition-shadow">
      <div className="flex gap-3 p-3">
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {listing.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-primary-600 font-medium">{listing.category}</p>
          <p className="text-sm font-semibold text-gray-900 truncate">{listing.title}</p>
          <p className="text-sm font-bold text-gray-700">{price}</p>
        </div>
      </div>
    </Link>
  )
}
