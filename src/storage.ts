import type { Round } from './types'

const ROUNDS_KEY = 'golf-rounds'
const CURRENT_ROUND_KEY = 'golf-current-round'

export function loadRounds(): Round[] {
  try {
    const raw = localStorage.getItem(ROUNDS_KEY)
    return raw ? (JSON.parse(raw) as Round[]) : []
  } catch {
    return []
  }
}

export function saveRounds(rounds: Round[]) {
  localStorage.setItem(ROUNDS_KEY, JSON.stringify(rounds))
}

export function loadCurrentRound(): Round | null {
  try {
    const raw = localStorage.getItem(CURRENT_ROUND_KEY)
    return raw ? (JSON.parse(raw) as Round) : null
  } catch {
    return null
  }
}

export function saveCurrentRound(round: Round | null) {
  if (round) {
    localStorage.setItem(CURRENT_ROUND_KEY, JSON.stringify(round))
  } else {
    localStorage.removeItem(CURRENT_ROUND_KEY)
  }
}
