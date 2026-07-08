'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { listingsApi, getErrorMessage } from '@/lib/api'
import { Navbar } from '@/components/Navbar'
import { ListingGrid } from '@/components/ListingGrid'
import { CategoryFilter } from '@/components/CategoryFilter'
import { SearchBar } from '@/components/SearchBar'
import { PriceRangeSlider } from '@/components/PriceRangeSlider'
import { Pagination } from '@/components/Pagination'
import { useToast } from '@/components/ToastProvider'
import type { Listing, PaginatedResponse } from '@/types'

export default function MarketplaceFeed() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [result, setResult] = useState<PaginatedResponse<Listing> | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login')
  }, [isAuthenticated, router])

  const fetchListings = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = { page, limit: 20, status: 'active' }
      if (category) params.category = category
      if (minPrice > 0) params.min_price = minPrice
      if (maxPrice > 0) params.max_price = maxPrice
      const { data } = await listingsApi.list(params)
      setResult(data)
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    } finally {
      setLoading(false)
    }
  }, [category, minPrice, maxPrice, page, toast])

  useEffect(() => {
    if (isAuthenticated) fetchListings()
  }, [isAuthenticated, fetchListings])

  const filteredListings = (result?.data ?? []).filter((l) =>
    search ? l.title.toLowerCase().includes(search.toLowerCase()) : true
  )

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="marketplace-feed">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar filters */}
          <aside className="lg:w-64 flex-shrink-0 space-y-6">
            <div className="card p-4 space-y-4">
              <h2 className="font-semibold text-gray-900 text-sm">Filters</h2>
              <SearchBar value={search} onChange={setSearch} />
              <CategoryFilter value={category} onChange={(c) => { setCategory(c); setPage(1) }} />
              <PriceRangeSlider
                min={minPrice}
                max={maxPrice}
                onCommit={(mn, mx) => { setMinPrice(mn); setMaxPrice(mx); setPage(1) }}
              />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">
                {category || 'All Listings'}
                {result && (
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    ({result.pagination.total} items)
                  </span>
                )}
              </h1>
            </div>

            <ListingGrid listings={filteredListings} loading={loading} />

            {result && (
              <Pagination
                pagination={result.pagination}
                onPage={(p) => setPage(p)}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
