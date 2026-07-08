'use client'
import { useState } from 'react'
import { usersApi, getErrorMessage } from '@/lib/api'
import { useToast } from '@/components/ToastProvider'
import type { UserStatus, Role } from '@/types'

interface Props {
  uid: string
  status: UserStatus
  role: Role
  onUpdate: (uid: string, status: 'active' | 'banned') => void
}

export function BanToggle({ uid, status, role, onUpdate }: Props) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  if (role === 'admin') return <span className="text-xs text-gray-400">protected</span>

  const isBanned = status === 'banned'

  const handle = async () => {
    const next = isBanned ? 'active' : 'banned'
    setLoading(true)
    try {
      await usersApi.updateStatus(uid, next)
      onUpdate(uid, next)
      toast(`User ${next === 'banned' ? 'banned' : 'reinstated'}`, 'success')
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className={isBanned ? 'btn-secondary text-xs py-1 px-2' : 'btn-danger text-xs py-1 px-2'}
    >
      {loading ? '…' : isBanned ? 'Reinstate' : 'Ban'}
    </button>
  )
}
