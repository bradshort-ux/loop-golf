'use client'

import { useState } from 'react'
import { WizardState, WizardMatch } from './types'

interface Props {
  state: WizardState
  update: (p: Partial<WizardState>) => void
  onNext: () => void
  onBack: () => void
}

function generateMatches(state: WizardState): WizardMatch[] {
  const players = state.players
  const courses = state.courses
  if (players.length < 2 || courses.length === 0) return []

  const matches: WizardMatch[] = []
  let matchNum = 1

  // Simple generation: one match per course per 9 holes (or full course)
  courses.forEach((course, ci) => {
    const day = ci === 0 ? 'Day 1' : ci === 1 ? 'Day 2' : `Day ${ci + 1}`
    const totalHoles = course.holes

    if (totalHoles >= 18) {
      // Front 9
      matches.push({
        id: crypto.randomUUID(),
        label: `Match ${matchNum++}`,
        day,
        tee_time: '',
        course_id: course.id,
        hole_start: 0,
        hole_end: 8,
        pairing_group: 'A',
        format: course.venue_type === 'putting' ? 'putting' : 'match_play',
        team1_ids: players.slice(0, Math.ceil(players.length / 2)).map(p => p.id),
        team2_ids: players.slice(Math.ceil(players.length / 2)).map(p => p.id),
        points: state.points_per_match,
        is_finale: false,
      })
      // Back 9
      matches.push({
        id: crypto.randomUUID(),
        label: `Match ${matchNum++}`,
        day,
        tee_time: '',
        course_id: course.id,
        hole_start: 9,
        hole_end: 17,
        pairing_group: 'B',
        format: course.venue_type === 'putting' ? 'putting' : 'match_play',
        team1_ids: players.slice(0, Math.ceil(players.length / 2)).map(p => p.id),
        team2_ids: players.slice(Math.ceil(players.length / 2)).map(p => p.id),
        points: state.points_per_match,
        is_finale: false,
      })
    } else {
      matches.push({
        id: crypto.randomUUID(),
        label: `Match ${matchNum++}`,
        day,
        tee_time: '',
        course_id: course.id,
        hole_start: 0,
        hole_end: totalHoles - 1,
        pairing_group: 'A',
        format: course.venue_type === 'putting' ? 'putting' : 'match_play',
        team1_ids: players.slice(0, Math.ceil(players.length / 2)).map(p => p.id),
        team2_ids: players.slice(Math.ceil(players.length / 2)).map(p => p.id),
        points: state.points_per_match,
        is_finale: false,
      })
    }
  })

  // Mark last match as finale
  if (matches.length > 0) {
    matches[matches.length - 1].is_finale = true
  }

  return matches
}

export default function Step5Schedule({ state, update, onNext, onBack }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  function handleGenerate() {
    const generated = generateMatches(state)
    update({ matches: generated })
  }

  function addMatch() {
    const course = state.courses[0]
    const newMatch: WizardMatch = {
      id: crypto.randomUUID(),
      label: `Match ${state.matches.length + 1}`,
      day: 'Day 1',
      tee_time: '',
      course_id: course?.id || '',
      hole_start: 0,
      hole_end: (course?.holes || 18) - 1,
      pairing_group: 'A',
      format: 'match_play',
      team1_ids: [],
      team2_ids: [],
      points: state.points_per_match,
      is_finale: false,
    }
    update({ matches: [...state.matches, newMatch] })
    setEditingId(newMatch.id)
  }

  function removeMatch(id: string) {
    update({ matches: state.matches.filter(m => m.id !== id) })
  }

  function updateMatch(id: string, field: keyof WizardMatch, value: unknown) {
    update({
      matches: state.matches.map(m => m.id === id ? { ...m, [field]: value } : m)
    })
  }

  function togglePlayerInTeam(matchId: string, playerId: string, team: 'team1_ids' | 'team2_ids') {
    const match = state.matches.find(m => m.id === matchId)
    if (!match) return
    const other = team === 'team1_ids' ? 'team2_ids' : 'team1_ids'
    const inOther = match[other].includes(playerId)
    if (inOther) return // can't be on both teams
    const current = match[team]
    const updated = current.includes(playerId)
      ? current.filter(id => id !== playerId)
      : [...current, playerId]
    updateMatch(matchId, team, updated)
  }

  function handleNext() {
    if (state.matches.length === 0) { setError('Add at least one match'); return }
    for (const m of state.matches) {
      if (m.team1_ids.length === 0 || m.team2_ids.length === 0) {
        setError(`${m.label} needs players assigned to both teams`); return
      }
    }
    setError('')
    onNext()
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-[#071428] mb-1">Schedule</h2>
      <p className="text-slate-500 text-sm mb-4">Build your match schedule</p>

      {state.matches.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center mb-4">
          <p className="text-slate-500 text-sm mb-4">Auto-generate a schedule based on your courses and players, or build it manually.</p>
          <button
            type="button"
            onClick={handleGenerate}
            className="bg-[#071428] hover:bg-[#0d2247] text-[#c8a84b] font-bold py-2 px-6 rounded-lg text-sm tracking-widest uppercase transition-colors"
          >
            ⚡ Auto-generate
          </button>
        </div>
      )}

      {state.matches.length > 0 && (
        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={handleGenerate}
            className="text-xs text-slate-400 hover:text-[#071428] border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            ↺ Re-generate
          </button>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {state.matches.map((match, mi) => (
          <div key={match.id} className="border border-slate-200 rounded-lg overflow-hidden">
            {/* Match header */}
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50"
              onClick={() => setEditingId(editingId === match.id ? null : match.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#071428] bg-slate-100 rounded px-2 py-0.5">{match.label}</span>
                <span className="text-xs text-slate-500">{match.day}</span>
                {match.is_finale && <span className="text-xs bg-[#c8a84b] text-[#071428] font-bold px-2 py-0.5 rounded">FINALE</span>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={e => { e.stopPropagation(); removeMatch(match.id) }} className="text-slate-300 hover:text-red-400 text-lg leading-none">×</button>
                <span className="text-slate-400 text-sm">{editingId === match.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {/* Match editor */}
            {editingId === match.id && (
              <div className="border-t border-slate-100 px-4 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Label</label>
                    <input type="text" value={match.label} onChange={e => updateMatch(match.id, 'label', e.target.value)}
                      className="w-full border border-slate-200 focus:border-[#071428] rounded px-2 py-1.5 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Day</label>
                    <input type="text" value={match.day} onChange={e => updateMatch(match.id, 'day', e.target.value)}
                      placeholder="e.g. Friday"
                      className="w-full border border-slate-200 focus:border-[#071428] rounded px-2 py-1.5 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Tee time</label>
                    <input type="time" value={match.tee_time} onChange={e => updateMatch(match.id, 'tee_time', e.target.value)}
                      className="w-full border border-slate-200 focus:border-[#071428] rounded px-2 py-1.5 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Course</label>
                    <select value={match.course_id} onChange={e => updateMatch(match.id, 'course_id', e.target.value)}
                      className="w-full border border-slate-200 focus:border-[#071428] rounded px-2 py-1.5 text-sm outline-none bg-white">
                      {state.courses.map(c => <option key={c.id} value={c.id}>{c.name || 'Unnamed course'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Holes</label>
                    <div className="flex gap-1 items-center">
                      <input type="number" value={match.hole_start + 1}
                        onChange={e => updateMatch(match.id, 'hole_start', Math.max(0, parseInt(e.target.value) - 1))}
                        min={1} max={18} className="w-14 border border-slate-200 rounded px-2 py-1.5 text-sm outline-none text-center" />
                      <span className="text-slate-400 text-xs">–</span>
                      <input type="number" value={match.hole_end + 1}
                        onChange={e => updateMatch(match.id, 'hole_end', Math.max(0, parseInt(e.target.value) - 1))}
                        min={1} max={18} className="w-14 border border-slate-200 rounded px-2 py-1.5 text-sm outline-none text-center" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Points</label>
                    <input type="number" value={match.points}
                      onChange={e => updateMatch(match.id, 'points', parseFloat(e.target.value) || 1)}
                      min={0.5} max={10} step={0.5}
                      className="w-20 border border-slate-200 focus:border-[#071428] rounded px-2 py-1.5 text-sm outline-none" />
                  </div>
                </div>

                {/* Team assignment */}
                <div className="grid grid-cols-2 gap-3">
                  {(['team1_ids', 'team2_ids'] as const).map((teamKey, ti) => (
                    <div key={teamKey}>
                      <div className="text-xs font-semibold text-slate-500 mb-2">
                        {ti === 0 ? '🟢 Team 1' : '🔴 Team 2'}
                      </div>
                      <div className="space-y-1">
                        {state.players.map(p => {
                          const inThis = match[teamKey].includes(p.id)
                          const other = teamKey === 'team1_ids' ? 'team2_ids' : 'team1_ids'
                          const inOther = match[other].includes(p.id)
                          return (
                            <button
                              key={p.id}
                              type="button"
                              disabled={inOther}
                              onClick={() => togglePlayerInTeam(match.id, p.id, teamKey)}
                              className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors
                                ${inThis ? 'bg-[#071428] text-[#c8a84b] font-semibold' :
                                  inOther ? 'bg-slate-50 text-slate-300 cursor-not-allowed' :
                                  'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                            >
                              <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: p.color }} />
                              {p.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Finale toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={match.is_finale}
                    onChange={e => updateMatch(match.id, 'is_finale', e.target.checked)}
                    className="accent-[#071428]" />
                  <span className="text-sm text-slate-600">Mark as Finale match</span>
                </label>
              </div>
            )}
          </div>
        ))}
      </div>

      <button type="button" onClick={addMatch}
        className="w-full border-2 border-dashed border-slate-200 hover:border-[#c8a84b] rounded-lg py-3 text-sm text-slate-400 hover:text-[#c8a84b] transition-colors">
        + Add match manually
      </button>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      <div className="mt-8 flex justify-between">
        <button type="button" onClick={onBack} className="text-slate-400 hover:text-slate-600 font-medium py-2.5 px-6 rounded-lg text-sm transition-colors">← Back</button>
        <button type="button" onClick={handleNext} className="bg-[#071428] hover:bg-[#0d2247] text-[#c8a84b] font-bold py-2.5 px-8 rounded-lg text-sm tracking-widest uppercase transition-colors">Next →</button>
      </div>
    </div>
  )
}