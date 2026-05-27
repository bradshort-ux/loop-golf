'use client'

import { WizardState } from './types'

interface Props {
  state: WizardState
  update: (p: Partial<WizardState>) => void
  onNext: () => void
  onBack: () => void
}

const SCORING_TYPES = [
  { value: 'match_play', label: 'Match Play', desc: 'Hole by hole — win, lose, or halve. Points per match.' },
  { value: 'stroke_play', label: 'Stroke Play', desc: 'Total strokes across all holes. Low score wins.' },
  { value: 'stableford', label: 'Stableford', desc: 'Points per hole based on score vs par. High score wins.' },
]

const TEAM_STRUCTURES = [
  { value: 'individual', label: 'Individual', desc: 'Each player competes on their own.' },
  { value: 'rotating_pairs', label: 'Rotating Pairs', desc: 'Partners change each match. Best for 4-8 players.' },
  { value: 'fixed_teams', label: 'Fixed Teams', desc: 'Two teams compete all weekend. Ryder Cup style.' },
]

const HANDICAP_METHODS = [
  { value: 'full', label: 'Full handicap', desc: 'Full difference between course handicaps.' },
  { value: 'three_quarter', label: '3/4 handicap', desc: '75% of the full difference.' },
  { value: 'none', label: 'Scratch', desc: 'No handicap strokes. Gross scores only.' },
]

export default function Step4Format({ state, update, onNext, onBack }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#071428] mb-1">Format</h2>
      <p className="text-slate-500 text-sm mb-6">How your event is scored and structured</p>

      <div className="space-y-6">
        {/* Scoring type */}
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">Scoring type</label>
          <div className="space-y-2">
            {SCORING_TYPES.map(opt => (
              <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                ${state.scoring_type === opt.value ? 'border-[#071428] bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                <input
                  type="radio"
                  name="scoring_type"
                  value={opt.value}
                  checked={state.scoring_type === opt.value}
                  onChange={() => update({ scoring_type: opt.value as WizardState['scoring_type'] })}
                  className="mt-0.5 accent-[#071428]"
                />
                <div>
                  <div className="text-sm font-semibold text-[#071428]">{opt.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Team structure */}
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">Team structure</label>
          <div className="space-y-2">
            {TEAM_STRUCTURES.map(opt => (
              <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                ${state.team_structure === opt.value ? 'border-[#071428] bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                <input
                  type="radio"
                  name="team_structure"
                  value={opt.value}
                  checked={state.team_structure === opt.value}
                  onChange={() => update({ team_structure: opt.value as WizardState['team_structure'] })}
                  className="mt-0.5 accent-[#071428]"
                />
                <div>
                  <div className="text-sm font-semibold text-[#071428]">{opt.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Handicap method */}
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">Handicap method</label>
          <div className="space-y-2">
            {HANDICAP_METHODS.map(opt => (
              <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                ${state.handicap_method === opt.value ? 'border-[#071428] bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                <input
                  type="radio"
                  name="handicap_method"
                  value={opt.value}
                  checked={state.handicap_method === opt.value}
                  onChange={() => update({ handicap_method: opt.value as WizardState['handicap_method'] })}
                  className="mt-0.5 accent-[#071428]"
                />
                <div>
                  <div className="text-sm font-semibold text-[#071428]">{opt.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Points per match */}
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-slate-500 mb-2">
            Default points per match
          </label>
          <input
            type="number"
            value={state.points_per_match}
            onChange={e => update({ points_per_match: parseInt(e.target.value) || 1 })}
            min={1} max={10}
            className="w-24 border border-slate-200 focus:border-[#071428] rounded-lg px-3 py-2 text-sm outline-none"
          />
          <p className="text-xs text-slate-400 mt-1">Can be overridden per match in Step 5</p>
        </div>

        {/* Skins */}
        <div className="border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-[#071428]">Skins game</div>
              <div className="text-xs text-slate-500">Low gross score wins each hole outright</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={state.skins_enabled}
                onChange={e => update({ skins_enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-200 peer-checked:bg-[#2d7a4f] rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
            </label>
          </div>

          {state.skins_enabled && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Buy-in per player ($)</label>
                  <input
                    type="number"
                    value={state.skins_buy_in ?? ''}
                    onChange={e => update({ skins_buy_in: e.target.value ? parseInt(e.target.value) : null })}
                    placeholder="e.g. 10"
                    min={0}
                    className="w-full border border-slate-200 focus:border-[#071428] rounded-lg px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.skins_carryover}
                  onChange={e => update({ skins_carryover: e.target.checked })}
                  className="accent-[#071428]"
                />
                <span className="text-sm text-slate-600">Ties carry over to next hole</span>
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button type="button" onClick={onBack} className="text-slate-400 hover:text-slate-600 font-medium py-2.5 px-6 rounded-lg text-sm transition-colors">
          ← Back
        </button>
        <button type="button" onClick={onNext} className="bg-[#071428] hover:bg-[#0d2247] text-[#c8a84b] font-bold py-2.5 px-8 rounded-lg text-sm tracking-widest uppercase transition-colors">
          Next →
        </button>
      </div>
    </div>
  )
}