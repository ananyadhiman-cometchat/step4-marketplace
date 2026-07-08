'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { conversationsApi, getErrorMessage } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ToastProvider'

interface Props {
  listingId: string
  sellerUid: string
}

export function ContactButton({ listingId, sellerUid }: Props) {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  if (!user || user.role !== 'buyer') return null
  if (user.uid === sellerUid) return null

  const handleContact = async () => {
    setLoading(true)
    try {
      const { data } = await conversationsApi.create(listingId)
      router.push(`/conversations/${data.id}`)
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleContact}
      disabled={loading}
      className="btn-primary w-full"
      data-testid="contact-button"
    >
      {loading ? 'Opening chat…' : 'Message Seller'}
    </button>
  )
}
