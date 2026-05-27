'use client'

import { useState } from 'react'
import { WizardState, WizardPlayer, PLAYER_COLORS } from './types'

interface Props {
  state: WizardState
  update: (p: Partial<WizardState>) => void
  onNext: () => void
  onBack: () => void
}

function newPlayer(index: number): WizardPlayer {
  return {
    id: crypto.randomUUID(),
    name: '',
    handicap_index: null,
    home_club: '',
    color: PLAYER_COLORS[index % PLAYER_COLORS.length],
  }
}

export default function Step2Players({ state, update, onNext, onBack }: Props) {
  const [error, setError] = useState('')

  function addPlayer() {
    update({ players: [...state.players, newPlayer(state.players.length)] })
  }

  function removePlayer(id: string) {
    update({ players: state.players.filter(p => p.id !== id) })
  }

  function updatePlayer(id: string, field: keyof WizardPlayer, value: string | number | null) {
    update({
      players: state.players.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    })
  }

  function handleNext() {
    if (state.players.length < 2) {
      setError('Add at least 2 players')
      return
    }
    if (state.players.some(p => !p.name.trim())) {
      setError('All players must have a name')
      return
    }
    setError('')
    onNext()
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-[#071428] mb-1">Players</h2>
      <p className="text-slate-500 text-sm mb-6">Add everyone in the field — 2 to 24 players</p>

      <div className="space-y-3 mb-4">
        {state.players.map((player, index) => (
          <div key={player.id} className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              {/* Color dot */}
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 cursor-pointer ring-2 ring-offset-2 ring-transparent hover:ring-slate-300"
                style={{ background: player.color }}
                title="Player color"
              />
              <span className="text-xs text-slate-400 font-medium">Player {index + 1}</span>
              <button
                onClick={() => removePlayer(player.id)}
                className="ml-auto text-slate-300 hover:text-red-400 text-lg leading-none transition-colors"
                title="Remove player"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <input
                  type="text"
                  value={player.name}
                  onChange={e => updatePlayer(player.id, 'name', e.target.value)}
                  placeholder="Full name *"
                  className="w-full border border-slate-200 focus:border-[#071428] rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={player.handicap_index ?? ''}
                  onChange={e => updatePlayer(player.id, 'handicap_index', e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="Handicap index"
                  step="0.1"
                  min="0"
                  max="54"
                  className="w-full border border-slate-200 focus:border-[#071428] rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={player.home_club}
                  onChange={e => updatePlayer(player.id, 'home_club', e.target.value)}
                  placeholder="Home club"
                  className="w-full border border-slate-200 focus:border-[#071428] rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                />
              </div>
            </div>

            {/* Color picker */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-slate-400">Color:</span>
              {PLAYER_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updatePlayer(player.id, 'color', color)}
                  className="w-5 h-5 rounded-full transition-transform hover:scale-110"
                  style={{
                    background: color,
                    outline: player.color === color ? `2px solid ${color}` : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {state.players.length < 24 && (
        <button
          type="button"
          onClick={addPlayer}
          className="w-full border-2 border-dashed border-slate-200 hover:border-[#c8a84b] rounded-lg py-3 text-sm text-slate-400 hover:text-[#c8a84b] transition-colors"
        >
          + Add player
        </button>
      )}

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-slate-400 hover:text-slate-600 font-medium py-2.5 px-6 rounded-lg text-sm transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="bg-[#071428] hover:bg-[#0d2247] text-[#c8a84b] font-bold py-2.5 px-8 rounded-lg text-sm tracking-widest uppercase transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  )
}     