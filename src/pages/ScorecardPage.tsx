import { PAR_TOTAL, SCORE_TOTAL, type Hole, type Round } from '../types'
import HoleCard from '../components/HoleCard'

interface Props {
  round: Round
  onChange: (round: Round) => void
  onNewRound: () => void
  onSaveRound: () => void
}

export default function ScorecardPage({ round, onChange, onNewRound, onSaveRound }: Props) {
  const front9 = round.holes.slice(0, 9)
  const back9 = round.holes.slice(9, 18)
  const par = PAR_TOTAL(round.holes)

  function updateHole(updated: Hole) {
    onChange({
      ...round,
      holes: round.holes.map((h) => (h.number === updated.number ? updated : h)),
    })
  }

  return (
    <div className="pb-28">
      <div className="flex items-center gap-2 border-b border-stone-200 bg-cream-50 px-4 py-3">
        <span className="text-lg">⛳</span>
        <input
          value={round.courseName}
          onChange={(e) => onChange({ ...round, courseName: e.target.value })}
          placeholder="Tap to enter course name"
          className="min-w-0 flex-1 bg-transparent text-base text-stone-500 placeholder:text-stone-400 focus:outline-none"
        />
        <span className="text-lg">✎</span>
      </div>

      <div className="grid grid-cols-3 divide-x divide-stone-200 border-b border-stone-200 bg-cream-50 py-3 text-center">
        <div>
          <div className="text-xs text-stone-400">Front 9 (OUT)</div>
          <div className="text-2xl font-bold text-stone-800">{SCORE_TOTAL(front9) || 0}</div>
        </div>
        <div>
          <div className="text-xs text-stone-400">Back 9 (IN)</div>
          <div className="text-2xl font-bold text-stone-800">{SCORE_TOTAL(back9) || 0}</div>
        </div>
        <div>
          <div className="text-xs text-stone-400">Par</div>
          <div className="text-2xl font-bold text-stone-800">{par}</div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="mb-2 text-xs font-semibold tracking-wide text-stone-400">OUT · FRONT 9</div>
        <div className="space-y-2">
          {front9.map((hole) => (
            <HoleCard key={hole.number} hole={hole} onChange={updateHole} />
          ))}
        </div>

        <div className="mb-2 mt-5 text-xs font-semibold tracking-wide text-stone-400">IN · BACK 9</div>
        <div className="space-y-2">
          {back9.map((hole) => (
            <HoleCard key={hole.number} hole={hole} onChange={updateHole} />
          ))}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto flex max-w-md gap-3 border-t border-stone-200 bg-cream-50 px-4 py-3">
        <button
          type="button"
          onClick={onNewRound}
          className="flex-1 rounded-xl bg-stone-200 py-3 font-semibold text-stone-600 active:bg-stone-300"
        >
          New Round
        </button>
        <button
          type="button"
          onClick={onSaveRound}
          className="flex-1 rounded-xl bg-green-900 py-3 font-semibold text-white active:bg-green-800"
        >
          Save Round
        </button>
      </div>
    </div>
  )
}
