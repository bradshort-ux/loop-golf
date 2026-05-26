import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!event) notFound()

  return (
    <div className="min-h-screen bg-[#071428]">
      <header className="bg-[#071428] border-b border-[#c8a84b]/20 px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <div className="text-xs tracking-widest uppercase text-[#c8a84b] mb-0.5">
              Loop Golf
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">{event.name}</h1>
          </div>
          <div className="text-right">
            {event.location && (
              <div className="text-xs text-[#8090a4]">{event.location}</div>
            )}
          </div>
        </div>
      </header>
      <div className="max-w-lg mx-auto px-5 py-12 text-center">
        <div className="text-5xl mb-4">⛳</div>
        <h2 className="text-xl font-bold text-white mb-2">{event.name}</h2>
        <p className="text-[#8090a4] text-sm mb-2">{event.location}</p>
        <p className="text-[#4a5a7a] text-xs mt-8">Powered by Loop Golf</p>
      </div>
    </div>
  )
}