'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { listingsApi, getErrorMessage } from '@/lib/api'
import { useToast } from '@/components/ToastProvider'
import type { Listing, CreateListingInput } from '@/types'
import { ImageUploader } from './ImageUploader'

const CATEGORIES = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Vehicles', 'Books', 'Other']

interface Props {
  initial?: Partial<Listing>
  listingId?: string
}

export function ListingForm({ initial, listingId }: Props) {
  const isEdit = !!listingId
  const [form, setForm] = useState<CreateListingInput>({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    price: initial?.price ?? 0,
    currency: initial?.currency ?? 'USD',
    category: initial?.category ?? CATEGORIES[0],
    images: initial?.images ?? [],
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const set = (field: keyof CreateListingInput, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.title || form.price <= 0) {
      toast('Title and a valid price are required', 'error')
      return
    }
    setLoading(true)
    try {
      if (isEdit) {
        await listingsApi.update(listingId, form)
        toast('Listing updated!', 'success')
        router.push(`/listings/${listingId}`)
      } else {
        const { data } = await listingsApi.create(form)
        toast('Listing created!', 'success')
        router.push(`/listings/${data.id}`)
      }
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="label">Title *</label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          className="input"
          placeholder="What are you selling?"
          maxLength={256}
        />
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          className="input resize-none"
          rows={4}
          placeholder="Describe your item in detail…"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Price *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              required
              min={0}
              step={0.01}
              value={form.price || ''}
              onChange={(e) => set('price', parseFloat(e.target.value) || 0)}
              className="input pl-7"
              placeholder="0.00"
            />
          </div>
        </div>
        <div>
          <label className="label">Currency</label>
          <select
            value={form.currency}
            onChange={(e) => set('currency', e.target.value)}
            className="input"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Category</label>
        <select
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          className="input"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Images</label>
        <ImageUploader images={form.images} onChange={(imgs) => set('images', imgs)} />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create listing'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}
