import type { Listing } from '@/types'

interface Props {
  listing: Listing
}

export function ListingInfo({ listing }: Props) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: listing.currency ?? 'USD',
  }).format(listing.price)

  const date = new Date(listing.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-4">
      <div>
        <span className="inline-block bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full mb-2">
          {listing.category}
        </span>
        <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
      </div>

      <p className="text-3xl font-bold text-gray-900">{formattedPrice}</p>

      {listing.description && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Description</h2>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{listing.description}</p>
        </div>
      )}

      <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
        Listed on {date}
      </div>
    </div>
  )
}
