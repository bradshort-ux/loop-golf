import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SignOutButton from './SignOutButton'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/signin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, email')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      {/* Top nav */}
      <header className="bg-[#071428] border-b border-[#c8a84b]/20">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-lg font-bold tracking-widest uppercase text-[#c8a84b]"
          >
            Loop Golf
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[#8090a4] text-sm hidden sm:block">
              {profile?.display_name || profile?.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}