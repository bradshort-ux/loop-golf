// Wizard state — shared across all steps

export interface WizardPlayer {
  id: string // temp client-side id
  name: string
  handicap_index: number | null
  home_club: string
  color: string
}

export interface WizardHole {
  par: number | null
  yards: number | null
  stroke_index: number | null
}

export interface WizardCourse {
  id: string // temp client-side id
  name: string
  tees: string
  rating: string
  slope: string
  holes: number
  venue_type: 'stroke' | 'par3' | 'putting'
  hole_data: WizardHole[]
}

export interface WizardMatch {
  id: string
  label: string
  day: string
  tee_time: string
  course_id: string
  hole_start: number
  hole_end: number
  pairing_group: string
  format: 'match_play' | 'stroke' | 'stableford' | 'putting'
  team1_ids: string[]
  team2_ids: string[]
  points: number
  is_finale: boolean
}

export interface WizardState {
  // Step 1 — Event basics
  name: string
  location: string
  start_date: string
  end_date: string
  buy_in: number | null

  // Step 2 — Players
  players: WizardPlayer[]

  // Step 3 — Courses
  courses: WizardCourse[]

  // Step 4 — Format
  scoring_type: 'match_play' | 'stroke_play' | 'stableford'
  team_structure: 'individual' | 'rotating_pairs' | 'fixed_teams'
  handicap_method: 'full' | 'three_quarter' | 'none'
  points_per_match: number
  skins_enabled: boolean
  skins_buy_in: number | null
  skins_carryover: boolean

  // Step 5 — Schedule
  matches: WizardMatch[]

  // Step 6 — Publish
  slug: string
  admin_code: string
  scorer_code: string
}

export const EMPTY_WIZARD: WizardState = {
  name: '',
  location: '',
  start_date: '',
  end_date: '',
  buy_in: null,
  players: [],
  courses: [],
  scoring_type: 'match_play',
  team_structure: 'rotating_pairs',
  handicap_method: 'full',
  points_per_match: 1,
  skins_enabled: false,
  skins_buy_in: null,
  skins_carryover: true,
  matches: [],
  slug: '',
  admin_code: '',
  scorer_code: '',
}

export const STEP_LABELS = [
  'Event basics',
  'Players',
  'Courses',
  'Format',
  'Schedule',
  'Publish',
]

export const PLAYER_COLORS = [
  '#2d7a4f', // green
  '#8b1a1a', // red
  '#1a4d8b', // blue
  '#7a6a1a', // gold
  '#5a1a7a', // purple
  '#1a7a7a', // teal
  '#7a3a1a', // orange
  '#4a4a4a', // grey
]