'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignUp() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#071428] flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-[#8090a4] text-sm mb-6">
            We sent a confirmation link to <span className="text-[#c8a84b]">{email}</span>.
            Click it to activate your account.
          </p>
          <Link href="/auth/signin" className="text-[#c8a84b] text-sm hover:underline">
            Back to sign in
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#071428] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-widest uppercase text-[#c8a84b]">
            Loop Golf
          </Link>
          <p className="text-[#8090a4] text-sm mt-2">Create your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs tracking-widest uppercase text-[#8090a4] mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full bg-[#0d2247] border border-[#c8a84b]/20 focus:border-[#c8a84b]/60 text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              placeholder="Brad Short"
            />
          </div>

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
              minLength={8}
              className="w-full bg-[#0d2247] border border-[#c8a84b]/20 focus:border-[#c8a84b]/60 text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              placeholder="Min. 8 characters"
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-[#8090a4] text-sm mt-6">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-[#c8a84b] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}