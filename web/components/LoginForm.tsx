'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, getErrorMessage } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ToastProvider'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast('Please fill in all fields', 'error')
      return
    }
    setLoading(true)
    try {
      const { data } = await authApi.login(email, password)
      signIn(data.token, data.cometchat_auth_token, data.user)
      toast(`Welcome back, ${data.user.name}!`, 'success')
      router.push('/')
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
      <div>
        <label htmlFor="email" className="label">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="you@example.com"
          data-testid="email-input"
        />
      </div>

      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="••••••••"
          data-testid="password-input"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full mt-2" data-testid="login-submit">
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-xs text-center text-gray-400 pt-2">
        Demo seed password: <code className="bg-gray-100 px-1 rounded">Mkt@seed2026!</code>
      </p>
    </form>
  )
}
