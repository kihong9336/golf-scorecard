import { HOLES_PLAYED, PLAYED_PAR_TOTAL, SCORE_TOTAL, toParString, type Hole } from '../types'

interface Props {
  holes: Hole[]
}

export default function Header({ holes }: Props) {
  const played = HOLES_PLAYED(holes)
  const total = SCORE_TOTAL(holes)
  const diff = total - PLAYED_PAR_TOTAL(holes)

  return (
    <div className="bg-green-900 px-4 pb-5 pt-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-2xl">
            🏌️
          </div>
          <div className="text-2xl font-bold tracking-tight">Kihong's Scoreboard</div>
        </div>
        {played > 0 && (
          <div className="text-right">
            <div className="text-3xl font-bold leading-none">{total}</div>
            <div className="text-sm font-medium text-white/70">{toParString(diff)}</div>
          </div>
        )}
      </div>
    </div>
  )
}
