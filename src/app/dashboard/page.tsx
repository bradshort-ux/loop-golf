import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Event } from '@/lib/supabase/types'

const STATUS_STYLES: Record<string, string> = {
  draft:    'bg-slate-100 text-slate-600',
  active:   'bg-green-100 text-green-700',
  complete: 'bg-blue-100 text-blue-700',
  archived: 'bg-gray-100 text-gray-500',
}

function formatDates(start: string | null, end: string | null) {
  if (!start) return '—'
  const s = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  if (!end) return s
  const e = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${s} – ${e}`
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('owner_id', user!.id)
    .order('created_at', { ascending: false })

  const eventList = (events || []) as Event[]

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#071428] tracking-tight">My Events</h1>
          <p className="text-slate-500 text-sm mt-1">
            {eventList.length === 0
              ? 'No events yet — create your first one'
              : `${eventList.length} event${eventList.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="bg-[#071428] hover:bg-[#0d2247] text-[#c8a84b] font-bold py-2 px-5 rounded-lg text-sm tracking-widest uppercase transition-colors"
        >
          + New Event
        </Link>
      </div>

      {/* Event list */}
      {eventList.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <div className="text-5xl mb-4">⛳</div>
          <h2 className="text-lg font-semibold text-[#071428] mb-2">No events yet</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
            Create your first Loop Golf event and share the link with your group.
          </p>
          <Link
            href="/dashboard/new"
            className="inline-block bg-[#c8a84b] hover:bg-[#e8cc7a] text-[#071428] font-bold py-2 px-6 rounded-lg text-sm tracking-widest uppercase transition-colors"
          >
            Create Event
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {eventList.map(event => (
            <div
              key={event.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between hover:border-[#c8a84b]/40 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="font-semibold text-[#071428] truncate">{event.name}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize flex-shrink-0 ${STATUS_STYLES[event.status]}`}>
                    {event.status}
                  </span>
                </div>
                <p className="text-slate-500 text-sm">
                  {event.location && <span className="mr-3">📍 {event.location}</span>}
                  <span>📅 {formatDates(event.start_date, event.end_date)}</span>
                </p>
                <p className="text-slate-400 text-xs mt-1 font-mono">
                  /e/{event.slug}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                <Link
                  href={`/e/${event.slug}`}
                  target="_blank"
                  className="text-xs text-slate-500 hover:text-[#071428] border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
                >
                  View ↗
                </Link>
                <Link
                  href={`/dashboard/events/${event.id}`}
                  className="text-xs text-[#c8a84b] hover:text-[#e8cc7a] border border-[#c8a84b]/40 hover:border-[#c8a84b] px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  Manage
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}