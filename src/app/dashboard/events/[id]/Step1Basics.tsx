'use client'

import { WizardState } from './types'

interface Props {
  state: WizardState
  update: (p: Partial<WizardState>) => void
  onNext: () => void
}

export default function Step1Basics({ state, update, onNext }: Props) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-[#071428] mb-1">Event basics</h2>
      <p className="text-slate-500 text-sm mb-6">Tell us about your trip</p>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">
            Event name *
          </label>
          <input
            type="text"
            value={state.name}
            onChange={e => update({ name: e.target.value })}
            required
            placeholder="e.g. Bandon Dunes 2027"
            className="w-full border border-slate-200 focus:border-[#071428] rounded-lg px-4 py-3 text-sm outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">
            Location
          </label>
          <input
            type="text"
            value={state.location}
            onChange={e => update({ location: e.target.value })}
            placeholder="e.g. Bandon, Oregon"
            className="w-full border border-slate-200 focus:border-[#071428] rounded-lg px-4 py-3 text-sm outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">
              Start date
            </label>
            <input
              type="date"
              value={state.start_date}
              onChange={e => update({ start_date: e.target.value })}
              className="w-full border border-slate-200 focus:border-[#071428] rounded-lg px-4 py-3 text-sm outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">
              End date
            </label>
            <input
              type="date"
              value={state.end_date}
              onChange={e => update({ end_date: e.target.value })}
              className="w-full border border-slate-200 focus:border-[#071428] rounded-lg px-4 py-3 text-sm outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">
            Buy-in per player ($)
          </label>
          <input
            type="number"
            value={state.buy_in ?? ''}
            onChange={e => update({ buy_in: e.target.value ? parseInt(e.target.value) : null })}
            placeholder="e.g. 50"
            min={0}
            className="w-full border border-slate-200 focus:border-[#071428] rounded-lg px-4 py-3 text-sm outline-none transition-colors"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={!state.name}
          className="bg-[#071428] hover:bg-[#0d2247] disabled:opacity-40 text-[#c8a84b] font-bold py-2.5 px-8 rounded-lg text-sm tracking-widest uppercase transition-colors"
        >
          Next →
        </button>
      </div>
    </form>
  )
}