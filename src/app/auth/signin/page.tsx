'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-[#071428] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-widest uppercase text-[#c8a84b]">
            Loop Golf
          </Link>
          <p className="text-[#8090a4] text-sm mt-2">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs tracking-widest uppercase text-[#8090a4] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-[#0d2247] border border-[#c8a84b]/20 focus:border-[#c8a84b]/60 text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-[#8090a4] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-[#0d2247] border border-[#c8a84b]/20 focus:border-[#c8a84b]/60 text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c8a84b] hover:bg-[#e8cc7a] disabled:opacity-50 text-[#071428] font-bold py-3 px-6 rounded-lg text-sm tracking-widest uppercase transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-[#8090a4] text-sm mt-6">
          No account?{' '}
          <Link href="/auth/signup" className="text-[#c8a84b] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}