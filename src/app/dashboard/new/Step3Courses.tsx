'use client'

import { useState } from 'react'
import { WizardState, WizardCourse, WizardHole } from './types'

interface Props {
  state: WizardState
  update: (p: Partial<WizardState>) => void
  onNext: () => void
  onBack: () => void
}

function emptyHoles(count: number): WizardHole[] {
  return Array.from({ length: count }, () => ({ par: null, yards: null, stroke_index: null }))
}

function newCourse(): WizardCourse {
  return {
    id: crypto.randomUUID(),
    name: '',
    tees: '',
    rating: '',
    slope: '',
    holes: 18,
    venue_type: 'stroke',
    hole_data: emptyHoles(18),
  }
}

export default function Step3Courses({ state, update, onNext, onBack }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [error, setError] = useState('')

  function addCourse() {
    const c = newCourse()
    update({ courses: [...state.courses, c] })
    setExpandedId(c.id)
  }

  function removeCourse(id: string) {
    update({ courses: state.courses.filter(c => c.id !== id) })
    if (expandedId === id) setExpandedId(null)
  }

  function updateCourse(id: string, field: keyof WizardCourse, value: unknown) {
    update({
      courses: state.courses.map(c => {
        if (c.id !== id) return c
        if (field === 'holes') {
          const n = value as number
          return { ...c, holes: n, hole_data: emptyHoles(n) }
        }
        return { ...c, [field]: value }
      })
    })
  }

  function updateHole(courseId: string, holeIndex: number, field: keyof WizardHole, value: string) {
    update({
      courses: state.courses.map(c => {
        if (c.id !== courseId) return c
        const newHoles = c.hole_data.map((h, i) => {
          if (i !== holeIndex) return h
          const num = value === '' ? null : parseInt(value)
          return { ...h, [field]: isNaN(num as number) ? null : num }
        })
        return { ...c, hole_data: newHoles }
      })
    })
  }

  function handleNext() {
    if (state.courses.length < 1) {
      setError('Add at least one course')
      return
    }
    for (const c of state.courses) {
      if (!c.name.trim()) { setError('All courses need a name'); return }
      if (c.venue_type !== 'putting') {
        const missing = c.hole_data.some(h => h.par === null || h.stroke_index === null)
        if (missing) { setError(`Complete par and SI for all holes on "${c.name}"`); return }
      }
    }
    setError('')
    onNext()
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-[#071428] mb-1">Courses</h2>
      <p className="text-slate-500 text-sm mb-6">Add the courses you&apos;ll be playing</p>

      <div className="space-y-3 mb-4">
        {state.courses.map((course, ci) => (
          <div key={course.id} className="border border-slate-200 rounded-lg overflow-hidden">
            {/* Course header */}
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50"
              onClick={() => setExpandedId(expandedId === course.id ? null : course.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{course.venue_type === 'putting' ? '🏌️' : '⛳'}</span>
                <span className="font-medium text-sm text-[#071428]">
                  {course.name || `Course ${ci + 1}`}
                </span>
                <span className="text-xs text-slate-400">{course.holes} holes</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={e => { e.stopPropagation(); removeCourse(course.id) }}
                  className="text-slate-300 hover:text-red-400 text-lg leading-none"
                >×</button>
                <span className="text-slate-400 text-sm">{expandedId === course.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {/* Course details */}
            {expandedId === course.id && (
              <div className="border-t border-slate-100 px-4 py-4 space-y-4">
                {/* Basic info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">Course name *</label>
                    <input
                      type="text"
                      value={course.name}
                      onChange={e => updateCourse(course.id, 'name', e.target.value)}
                      placeholder="e.g. Bandon Dunes"
                      className="w-full border border-slate-200 focus:border-[#071428] rounded-lg px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">Tees</label>
                    <input
                      type="text"
                      value={course.tees}
                      onChange={e => updateCourse(course.id, 'tees', e.target.value)}
                      placeholder="e.g. Blue"
                      className="w-full border border-slate-200 focus:border-[#071428] rounded-lg px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">Venue type</label>
                    <select
                      value={course.venue_type}
                      onChange={e => updateCourse(course.id, 'venue_type', e.target.value)}
                      className="w-full border border-slate-200 focus:border-[#071428] rounded-lg px-3 py-2 text-sm outline-none bg-white"
                    >
                      <option value="stroke">Stroke / Match play</option>
                      <option value="par3">Par 3 course</option>
                      <option value="putting">Putting course</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">Rating</label>
                    <input
                      type="text"
                      value={course.rating}
                      onChange={e => updateCourse(course.id, 'rating', e.target.value)}
                      placeholder="e.g. 75.4"
                      className="w-full border border-slate-200 focus:border-[#071428] rounded-lg px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">Slope</label>
                    <input
                      type="text"
                      value={course.slope}
                      onChange={e => updateCourse(course.id, 'slope', e.target.value)}
                      placeholder="e.g. 144"
                      className="w-full border border-slate-200 focus:border-[#071428] rounded-lg px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">Holes</label>
                    <select
                      value={course.holes}
                      onChange={e => updateCourse(course.id, 'holes', parseInt(e.target.value))}
                      className="w-full border border-slate-200 focus:border-[#071428] rounded-lg px-3 py-2 text-sm outline-none bg-white"
                    >
                      {[9, 10, 18].map(n => (
                        <option key={n} value={n}>{n} holes</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Hole-by-hole data */}
                {course.venue_type !== 'putting' && (
                  <div>
                    <div className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">
                      Hole data <span className="text-red-400">* Par & SI required</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="text-left px-2 py-1.5 text-xs font-semibold text-slate-500 w-10">Hole</th>
                            <th className="px-2 py-1.5 text-xs font-semibold text-slate-500 text-center">Par *</th>
                            <th className="px-2 py-1.5 text-xs font-semibold text-slate-500 text-center">SI *</th>
                            <th className="px-2 py-1.5 text-xs font-semibold text-slate-500 text-center">Yds</th>
                          </tr>
                        </thead>
                        <tbody>
                          {course.hole_data.map((hole, hi) => (
                            <tr key={hi} className={hi % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                              <td className="px-2 py-1 text-xs text-slate-400 font-medium">{hi + 1}</td>
                              <td className="px-2 py-1">
                                <input
                                  type="number"
                                  value={hole.par ?? ''}
                                  onChange={e => updateHole(course.id, hi, 'par', e.target.value)}
                                  min={2} max={6}
                                  className="w-14 text-center border border-slate-200 focus:border-[#071428] rounded px-1 py-1 text-xs outline-none"
                                />
                              </td>
                              <td className="px-2 py-1">
                                <input
                                  type="number"
                                  value={hole.stroke_index ?? ''}
                                  onChange={e => updateHole(course.id, hi, 'stroke_index', e.target.value)}
                                  min={1} max={course.holes}
                                  className="w-14 text-center border border-slate-200 focus:border-[#071428] rounded px-1 py-1 text-xs outline-none"
                                />
                              </td>
                              <td className="px-2 py-1">
                                <input
                                  type="number"
                                  value={hole.yards ?? ''}
                                  onChange={e => updateHole(course.id, hi, 'yards', e.target.value)}
                                  min={0} max={700}
                                  className="w-16 text-center border border-slate-200 focus:border-[#071428] rounded px-1 py-1 text-xs outline-none"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {course.venue_type === 'putting' && (
                  <p className="text-xs text-slate-400 italic">Putting course — no par or SI required. Stroke count only.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addCourse}
        className="w-full border-2 border-dashed border-slate-200 hover:border-[#c8a84b] rounded-lg py-3 text-sm text-slate-400 hover:text-[#c8a84b] transition-colors"
      >
        + Add course
      </button>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      <div className="mt-8 flex justify-between">
        <button type="button" onClick={onBack} className="text-slate-400 hover:text-slate-600 font-medium py-2.5 px-6 rounded-lg text-sm transition-colors">
          ← Back
        </button>
        <button type="button" onClick={handleNext} className="bg-[#071428] hover:bg-[#0d2247] text-[#c8a84b] font-bold py-2.5 px-8 rounded-lg text-sm tracking-widest uppercase transition-colors">
          Next →
        </button>
      </div>
    </div>
  )
}