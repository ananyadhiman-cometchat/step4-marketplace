import type { SellerSummary } from '@/types'

interface Props {
  seller: SellerSummary
}

export function SellerCard({ seller }: Props) {
  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Seller</h3>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold">
          {seller.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">{seller.name}</p>
          <p className="text-xs text-gray-500 capitalize">Seller</p>
        </div>
      </div>
    </div>
  )
}
