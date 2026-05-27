import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function EventManagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('*, players(*), courses(*), matches(*)')
    .eq('id', id)
    .single()

  if (!event) notFound()

  const playerCount = event.players?.length || 0
  const matchCount = event.matches?.length || 0
  const totalPoints = event.matches?.reduce((a: number, m: { points: number }) => a + m.points, 0) || 0

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link href="/dashboard" className="text-xs text-slate-400 hover:text-slate-600 mb-2 block">← My Events</Link>
          <h1 className="text-2xl font-bold text-[#071428]">{event.name}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {event.location && <span className="mr-3">📍 {event.location}</span>}
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize
              ${event.status === 'active' ? 'bg-green-100 text-green-700' :
                event.status === 'draft' ? 'bg-slate-100 text-slate-600' :
                'bg-blue-100 text-blue-700'}`}>
              {event.status}
            </span>
          </p>
        </div>
        <Link
          href={`/e/${event.slug}`}
          target="_blank"
          className="text-sm border border-[#c8a84b]/40 text-[#c8a84b] hover:border-[#c8a84b] px-4 py-2 rounded-lg transition-colors font-medium"
        >
          View event ↗
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Players', value: playerCount },
          { label: 'Matches', value: matchCount },
          { label: 'Total points', value: totalPoints },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#071428]">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Event URL */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
        <div className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">Event URL</div>
        <div className="flex items-center gap-3">
          <code className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-[#071428]">
            {typeof window !== 'undefined' ? window.location.origin : 'https://loop-golf-psi.vercel.app'}/e/{event.slug}
          </code>
          <Link
            href={`/e/${event.slug}`}
            target="_blank"
            className="text-xs text-[#c8a84b] border border-[#c8a84b]/40 px-3 py-2 rounded-lg hover:border-[#c8a84b] transition-colors whitespace-nowrap"
          >
            Open ↗
          </Link>
        </div>
        <p className="text-xs text-slate-400 mt-2">Share this link with your group</p>
      </div>

      {/* Access codes */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
        <div className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">Access codes</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-400 mb-1">Admin code</div>
            <code className="text-sm font-mono text-[#071428]">{event.admin_code || '—'}</code>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">Scorer code</div>
            <code className="text-sm font-mono text-[#071428]">{event.scorer_code || '—'}</code>
          </div>
        </div>
      </div>

      {/* Players */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
        <div className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">Players</div>
        <div className="space-y-2">
          {event.players?.map((p: { id: string; color: string; name: string; handicap_index: number | null; home_club: string | null }) => (
            <div key={p.id} className="flex items-center gap-3 py-1">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.color || '#666' }} />
              <span className="text-sm font-medium text-[#071428]">{p.name}</span>
              {p.handicap_index !== null && (
                <span className="text-xs text-slate-400">HCP {p.handicap_index}</span>
              )}
              {p.home_club && (
                <span className="text-xs text-slate-400 ml-auto">{p.home_club}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Matches */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">Matches</div>
        <div className="space-y-2">
          {event.matches?.map((m: { id: string; label: string; day: string | null; tee_time: string | null; points: number; is_finale: boolean; status: string }) => (
            <div key={m.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#071428]">{m.label}</span>
                {m.is_finale && <span className="text-xs bg-[#c8a84b] text-[#071428] font-bold px-1.5 py-0.5 rounded">FINALE</span>}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                {m.day && <span>{m.day}</span>}
                {m.tee_time && <span>{m.tee_time}</span>}
                <span className="font-medium text-[#071428]">{m.points} pt{m.points !== 1 ? 's' : ''}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}