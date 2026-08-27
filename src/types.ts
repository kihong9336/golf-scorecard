export const CLUBS = [
  'Driver',
  '3W',
  '5W',
  'Hybrid',
  '3i',
  '4i',
  '5i',
  '6i',
  '7i',
  '8i',
  '9i',
  'PW',
  'GW',
  'SW',
  'LW',
  'Putt',
] as const

export type Club = (typeof CLUBS)[number]

export type ShotTag = 'OB' | 'HZD' | 'FW' | 'BK' | null

export type ShotDirection = 'L' | 'C' | 'R' | null

export interface Shot {
  id: string
  club: Club | null
  distance: number | null
  tag: ShotTag
  direction: ShotDirection
}

export interface Hole {
  number: number
  par: 3 | 4 | 5
  distance: number | null
  score: number | null
  shots: Shot[]
  notes: string
  shotsVisible: boolean
}

export type RoundStatus = 'active' | 'closed'

export interface Round {
  id: string
  courseName: string
  date: string
  holes: Hole[]
  savedAt: string | null
  status: RoundStatus
}

export function createEmptyHole(number: number): Hole {
  return {
    number,
    par: 4,
    distance: null,
    score: null,
    shots: [],
    notes: '',
    shotsVisible: false,
  }
}

export function createEmptyRound(): Round {
  return {
    id: crypto.randomUUID(),
    courseName: '',
    date: new Date().toISOString(),
    holes: Array.from({ length: 18 }, (_, i) => createEmptyHole(i + 1)),
    savedAt: null,
    status: 'active',
  }
}

export function createShot(): Shot {
  return { id: crypto.randomUUID(), club: null, distance: null, tag: null, direction: null }
}

export const PAR_TOTAL = (holes: Hole[]) => holes.reduce((sum, h) => sum + h.par, 0)

export const SCORE_TOTAL = (holes: Hole[]) =>
  holes.reduce((sum, h) => sum + (h.score ?? 0), 0)

export const HOLES_PLAYED = (holes: Hole[]) => holes.filter((h) => h.score !== null).length

export const PLAYED_PAR_TOTAL = (holes: Hole[]) =>
  holes.filter((h) => h.score !== null).reduce((sum, h) => sum + h.par, 0)

export function toParString(diff: number): string {
  if (diff === 0) return 'E'
  return diff > 0 ? `+${diff}` : `${diff}`
}

export function scoreLabel(score: number, par: number): string {
  const diff = score - par
  if (diff <= -2) return 'Eagle'
  if (diff === -1) return 'Birdie'
  if (diff === 0) return 'Par'
  if (diff === 1) return 'Bogey'
  if (diff === 2) return 'Double'
  if (diff === 3) return 'Triple'
  return `+${diff}`
}

export function puttCount(shots: Shot[]): number {
  return shots.filter((s) => s.club === 'Putt').length
}
