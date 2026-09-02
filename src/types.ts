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

export const CLUB_LABELS: Record<Club, string> = {
  Driver: 'Driver',
  '3W': '3W',
  '5W': '5W',
  Hybrid: 'Hybrid',
  '3i': '3i',
  '4i': '4i',
  '5i': '5i',
  '6i': '6i',
  '7i': '7i',
  '8i': '8i',
  '9i': '9i',
  PW: 'PW',
  GW: 'GW(48)',
  SW: 'SW(54)',
  LW: 'LW(58)',
  Putt: 'Putt',
}

export type ShotTag = 'OB' | 'HZD' | 'FW' | 'BK' | 'GR' | 'RF' | null

export const FULL_SWING_SHAPES = [
  'STRAIGHT',
  'DRAW',
  'FADE',
  'SLICE',
  'HOOK',
  'PUSH',
  'PULL',
  'TOP',
  'FAT',
  'SHANK',
] as const

export const SHORT_GAME_SHAPES = [
  'GOOD',
  'L_LONG',
  'L_SHORT',
  'R_LONG',
  'R_SHORT',
  'M_LONG',
  'M_SHORT',
  'TOP',
  'FAT',
  'SHANK',
] as const

export type ShotShape = (typeof FULL_SWING_SHAPES)[number] | (typeof SHORT_GAME_SHAPES)[number] | null

export const SHOT_SHAPE_LABELS: Record<Exclude<ShotShape, null>, string> = {
  STRAIGHT: 'ST',
  DRAW: 'DR',
  FADE: 'FD',
  SLICE: 'SL',
  HOOK: 'HK',
  PUSH: 'PS',
  PULL: 'PL',
  TOP: 'TS',
  FAT: 'DF',
  SHANK: 'SK',
  GOOD: 'Gd',
  L_LONG: 'LL',
  L_SHORT: 'LS',
  R_LONG: 'RL',
  R_SHORT: 'RS',
  M_LONG: 'ML',
  M_SHORT: 'MS',
}

export const SHOT_SHAPE_OPTION_LABELS: Record<Exclude<ShotShape, null>, string> = {
  STRAIGHT: '스트레이트',
  DRAW: '드로우',
  FADE: '페이드',
  SLICE: '슬라이스',
  HOOK: '훅',
  PUSH: '푸쉬',
  PULL: '풀',
  TOP: '탑볼',
  FAT: '뒷땅',
  SHANK: '생크',
  GOOD: 'Good',
  L_LONG: 'L-long',
  L_SHORT: 'L-short',
  R_LONG: 'R-long',
  R_SHORT: 'R-short',
  M_LONG: 'M-long',
  M_SHORT: 'M-short',
}

export type ShotShapeGroup = 'full-swing' | 'short-game'

const SHORT_GAME_CLUBS: Club[] = ['GW', 'SW', 'LW', 'Putt']

export function shotShapeGroup(club: Club | null): ShotShapeGroup {
  return club !== null && SHORT_GAME_CLUBS.includes(club) ? 'short-game' : 'full-swing'
}

export const SHOT_SHAPES_BY_GROUP: Record<ShotShapeGroup, readonly Exclude<ShotShape, null>[]> = {
  'full-swing': FULL_SWING_SHAPES,
  'short-game': SHORT_GAME_SHAPES,
}

export type ClubCategory = 'wood' | 'iron' | 'putter'

const WOOD_CLUBS: Club[] = ['Driver', '3W', '5W']

export function clubCategory(club: Club | null): ClubCategory {
  if (club === 'Putt') return 'putter'
  if (club !== null && WOOD_CLUBS.includes(club)) return 'wood'
  return 'iron'
}

export const TAG_CYCLE_BY_CATEGORY: Record<ClubCategory, ShotTag[]> = {
  wood: ['FW', 'RF', 'HZD', 'OB', 'BK', 'GR'],
  iron: ['FW', 'RF', 'GR', 'BK', 'HZD', 'OB'],
  putter: ['GR', 'FW', 'RF', 'BK', 'HZD', 'OB'],
}

export function defaultTagForClub(club: Club | null): ShotTag {
  return TAG_CYCLE_BY_CATEGORY[clubCategory(club)][0]
}

export interface Shot {
  id: string
  club: Club | null
  distance: number | null
  tag: ShotTag
  shape: ShotShape
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
  return { id: crypto.randomUUID(), club: null, distance: null, tag: defaultTagForClub(null), shape: null }
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
