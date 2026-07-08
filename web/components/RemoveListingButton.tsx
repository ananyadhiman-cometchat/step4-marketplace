'use client'
import { useState } from 'react'
import { listingsApi, getErrorMessage } from '@/lib/api'
import { useToast } from '@/components/ToastProvider'

interface Props {
  listingId: string
  onRemoved?: () => void
}

export function RemoveListingButton({ listingId, onRemoved }: Props) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handle = async () => {
    if (!confirm('Remove this listing?')) return
    setLoading(true)
    try {
      await listingsApi.remove(listingId)
      toast('Listing removed', 'success')
      onRemoved?.()
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handle} disabled={loading} className="btn-danger text-xs py-1 px-2">
      {loading ? '…' : 'Remove'}
    </button>
  )
}
