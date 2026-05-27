'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { EMPTY_WIZARD, STEP_LABELS, WizardState } from './types'
import Step1Basics from './Step1Basics'
import Step2Players from './Step2Players'
import Step3Courses from './Step3Courses'
import Step4Format from './Step4Format'
import Step5Schedule from './Step5Schedule'
import Step6Publish from './Step6Publish'

export default function NewEventPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [state, setState] = useState<WizardState>(EMPTY_WIZARD)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function update(partial: Partial<WizardState>) {
    setState(prev => ({ ...prev, ...partial }))
  }

  function next() { setStep(s => Math.min(s + 1, 5)) }
  function back() { setStep(s => Math.max(s - 1, 0)) }

  async function publish() {
    setSaving(true)
    setError('')

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not signed in')

      // 1. Create event
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          owner_id: user.id,
          name: state.name,
          location: state.location,
          start_date: state.start_date || null,
          end_date: state.end_date || null,
          status: 'active',
          slug: state.slug,
          admin_code: state.admin_code,
          scorer_code: state.scorer_code,
          format: {
            type: state.scoring_type,
            team_structure: state.team_structure,
            handicap_method: state.handicap_method,
            points_per_match: state.points_per_match,
            skins_enabled: state.skins_enabled,
            skins_buy_in: state.skins_buy_in,
            skins_carryover: state.skins_carryover,
          },
          payout: {
            buy_in: state.buy_in,
          },
          settings: {
            color_coding: true,
            scoring_mode: 'live',
          },
        })
        .select()
        .single()

      if (eventError) throw eventError

      // 2. Insert players and build id map
      const playerIdMap: Record<string, string> = {}
      for (const p of state.players) {
        const { data: player, error: pErr } = await supabase
          .from('players')
          .insert({
            event_id: event.id,
            name: p.name,
            handicap_index: p.handicap_index,
            home_club: p.home_club,
            color: p.color,
            sort_order: state.players.indexOf(p),
          })
          .select()
          .single()
        if (pErr) throw pErr
        playerIdMap[p.id] = player.id
      }

      // 3. Insert courses and build id map
      const courseIdMap: Record<string, string> = {}
      for (const c of state.courses) {
        const { data: course, error: cErr } = await supabase
          .from('courses')
          .insert({
            event_id: event.id,
            name: c.name,
            tees: c.tees,
            rating: c.rating ? parseFloat(c.rating) : null,
            slope: c.slope ? parseInt(c.slope) : null,
            holes: c.holes,
            venue_type: c.venue_type,
            par: c.hole_data.map(h => h.par),
            yards: c.hole_data.map(h => h.yards),
            stroke_index: c.hole_data.map(h => h.stroke_index),
            sort_order: state.courses.indexOf(c),
          })
          .select()
          .single()
        if (cErr) throw cErr
        courseIdMap[c.id] = course.id
      }

      // 4. Insert matches
      for (const m of state.matches) {
        const { error: mErr } = await supabase
          .from('matches')
          .insert({
            event_id: event.id,
            course_id: courseIdMap[m.course_id] || null,
            label: m.label,
            day: m.day,
            tee_time: m.tee_time || null,
            hole_start: m.hole_start,
            hole_end: m.hole_end,
            pairing_group: m.pairing_group,
            format: m.format,
            team1_ids: m.team1_ids.map(id => playerIdMap[id]),
            team2_ids: m.team2_ids.map(id => playerIdMap[id]),
            points: m.points,
            is_finale: m.is_finale,
            status: 'pending',
            sort_order: state.matches.indexOf(m),
          })
        if (mErr) throw mErr
      }

      router.push(`/dashboard/events/${event.id}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setSaving(false)
    }
  }

  const steps = [
    <Step1Basics key={0} state={state} update={update} onNext={next} />,
    <Step2Players key={1} state={state} update={update} onNext={next} onBack={back} />,
    <Step3Courses key={2} state={state} update={update} onNext={next} onBack={back} />,
    <Step4Format key={3} state={state} update={update} onNext={next} onBack={back} />,
    <Step5Schedule key={4} state={state} update={update} onNext={next} onBack={back} />,
    <Step6Publish key={5} state={state} update={update} onBack={back} onPublish={publish} saving={saving} error={error} />,
  ]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                ${i < step ? 'bg-[#2d7a4f] text-white' :
                  i === step ? 'bg-[#071428] text-[#c8a84b] border-2 border-[#c8a84b]' :
                  'bg-slate-200 text-slate-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? 'text-[#071428] font-semibold' : 'text-slate-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div
            className="bg-[#c8a84b] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((step) / (STEP_LABELS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
        {steps[step]}
      </div>
    </div>
  )
}