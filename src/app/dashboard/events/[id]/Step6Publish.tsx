'use client'

import { WizardState } from './types'

interface Props {
  state: WizardState
  update: (p: Partial<WizardState>) => void
  onBack: () => void
  onPublish: () => void
  saving: boolean
  error: string
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function Step6Publish({ state, update, onBack, onPublish, saving, error }: Props) {
  // Auto-suggest slug from event name
  const suggestedSlug = slugify(state.name)

  return (
    <div>
      <h2 className="text-xl font-bold text-[#071428] mb-1">Review &amp; Publish</h2>
      <p className="text-slate-500 text-sm mb-6">Everything looks good? Set your access codes and go live.</p>

      {/* Summary */}
      <div className="bg-slate-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Event</span>
          <span className="font-semibold text-[#071428]">{state.name}</span>
        </div>
        {state.location && (
          <div className="flex justify-between">
            <span className="text-slate-500">Location</span>
            <span className="text-[#071428]">{state.location}</span>
          </div>
        )}
        {state.start_date && (
          <div className="flex justify-between">
            <span className="text-slate-500">Dates</span>
            <span className="text-[#071428]">{state.start_date}{state.end_date ? ` – ${state.end_date}` : ''}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-500">Players</span>
          <span className="text-[#071428]">{state.players.length} players</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Courses</span>
          <span className="text-[#071428]">{state.courses.length} course{state.courses.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Matches</span>
          <span className="text-[#071428]">{state.matches.length} matches &middot; {state.matches.reduce((a, m) => a + m.points, 0)} pts total</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Format</span>
          <span className="text-[#071428] capitalize">{state.scoring_type.replace('_', ' ')}</span>
        </div>
        {state.skins_enabled && (
          <div className="flex justify-between">
            <span className="text-slate-500">Skins</span>
            <span className="text-[#071428]">${state.skins_buy_in}/player {state.skins_carryover ? '· carryover' : ''}</span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {/* Event URL slug */}
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">
            Event URL *
          </label>
          <div className="flex items-center border border-slate-200 focus-within:border-[#071428] rounded-lg overflow-hidden transition-colors">
            <span className="bg-slate-50 border-r border-slate-200 px-3 py-3 text-xs text-slate-400 whitespace-nowrap">
              loopgolf.app/e/
            </span>
            <input
              type="text"
              value={state.slug || suggestedSlug}
              onChange={e => update({ slug: slugify(e.target.value) })}
              placeholder={suggestedSlug}
              className="flex-1 px-3 py-3 text-sm outline-none"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Lowercase letters, numbers, and hyphens only</p>
        </div>

        {/* Admin code */}
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">
            Admin code
          </label>
          <input
            type="text"
            value={state.admin_code}
            onChange={e => update({ admin_code: e.target.value })}
            placeholder="Secret code to override scores"
            className="w-full border border-slate-200 focus:border-[#071428] rounded-lg px-4 py-3 text-sm outline-none transition-colors"
          />
          <p className="text-xs text-slate-400 mt-1">Required to clear scores and record overrides</p>
        </div>

        {/* Scorer code */}
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">
            Scorer code
          </label>
          <input
            type="text"
            value={state.scorer_code}
            onChange={e => update({ scorer_code: e.target.value })}
            placeholder="Code scorers enter to post scores"
            className="w-full border border-slate-200 focus:border-[#071428] rounded-lg px-4 py-3 text-sm outline-none transition-colors"
          />
          <p className="text-xs text-slate-400 mt-1">Share this with whoever is keeping score in each group</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button type="button" onClick={onBack}
          className="text-slate-400 hover:text-slate-600 font-medium py-2.5 px-6 rounded-lg text-sm transition-colors">
          ← Back
        </button>
        <button
          type="button"
          onClick={() => {
            if (!state.slug && suggestedSlug) {
              update({ slug: suggestedSlug })
            }
            onPublish()
          }}
          disabled={saving || !state.name}
          className="bg-[#c8a84b] hover:bg-[#e8cc7a] disabled:opacity-40 text-[#071428] font-bold py-2.5 px-8 rounded-lg text-sm tracking-widest uppercase transition-colors"
        >
          {saving ? 'Publishing...' : '🚀 Publish Event'}
        </button>
      </div>
    </div>
  )
}