import Link from 'next/link'
import type { Listing } from '@/types'

interface Props {
  listing: Listing
}

export function ListingCard({ listing }: Props) {
  const imageSrc = listing.images?.[0] ?? null
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: listing.currency ?? 'USD',
  }).format(listing.price)

  return (
    <Link href={`/listings/${listing.id}`} className="card group hover:shadow-md transition-shadow block">
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {listing.status !== 'active' && (
          <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-0.5 rounded capitalize">
            {listing.status}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-primary-600 font-medium mb-1">{listing.category}</p>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">{listing.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{formattedPrice}</span>
          <span className="text-xs text-gray-400">{listing.seller.name}</span>
        </div>
      </div>
    </Link>
  )
}
