import { createShot, puttCount, scoreLabel, type Hole, type Shot } from '../types'
import ShotRow from './ShotRow'

interface Props {
  hole: Hole
  onChange: (hole: Hole) => void
}

export default function HoleCard({ hole, onChange }: Props) {
  const putts = puttCount(hole.shots)
  const label = hole.score !== null ? scoreLabel(hole.score, hole.par) : '-'

  function incrementScore() {
    onChange({ ...hole, score: hole.score === null ? hole.par : hole.score + 1 })
  }

  function decrementScore() {
    if (hole.score === null) return
    const next = hole.score - 1
    onChange({ ...hole, score: next <= 0 ? null : next })
  }

  function updateShot(shotId: string, updated: Shot) {
    onChange({ ...hole, shots: hole.shots.map((s) => (s.id === shotId ? updated : s)) })
  }

  function deleteShot(shotId: string) {
    onChange({ ...hole, shots: hole.shots.filter((s) => s.id !== shotId) })
  }

  function addShot() {
    onChange({ ...hole, shots: [...hole.shots, createShot()] })
  }

  return (
    <div className="rounded-2xl bg-white/70 p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
        <div className="w-6 shrink-0 text-lg font-bold text-green-900">{hole.number}</div>

        <div className="flex shrink-0 items-center gap-1 text-sm text-stone-500">
          <span>Par</span>
          <select
            value={hole.par}
            onChange={(e) => onChange({ ...hole, par: Number(e.target.value) as 3 | 4 | 5 })}
            className="rounded-lg border border-stone-300 bg-white px-1.5 py-1 text-sm text-stone-700"
          >
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>

        <div className="flex min-w-0 shrink-0 items-center gap-1">
          <input
            type="number"
            inputMode="numeric"
            placeholder="-"
            value={hole.distance ?? ''}
            onChange={(e) =>
              onChange({ ...hole, distance: e.target.value === '' ? null : Number(e.target.value) })
            }
            className="w-16 rounded-lg border border-stone-300 bg-white px-2 py-1 text-center text-sm text-stone-700"
          />
          <span className="text-sm text-stone-400">m</span>
        </div>

        <button
          type="button"
          onClick={() => onChange({ ...hole, shotsVisible: !hole.shotsVisible })}
          className="shrink-0 text-sm font-medium text-green-700"
        >
          {hole.shotsVisible ? '▲ Hide shots' : '▼ 샷 기록'}
        </button>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={decrementScore}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-green-900/10 text-lg font-bold text-green-900 active:bg-green-900/20"
            aria-label="스코어 감소"
          >
            −
          </button>
          <div className="w-10 text-center">
            <span className="text-xl font-bold text-stone-800">{hole.score ?? '-'}</span>
            {hole.shots.length > 0 && putts > 0 && (
              <span className="ml-0.5 text-xs text-stone-400">({putts})</span>
            )}
          </div>
          <button
            type="button"
            onClick={incrementScore}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-green-900 text-lg font-bold text-white active:bg-green-800"
            aria-label="스코어 증가"
          >
            +
          </button>
        </div>

        <div className="w-16 shrink-0 text-right text-sm text-stone-500">{label}</div>
      </div>

      {hole.shotsVisible && (
        <div className="mt-3 border-t border-stone-200 pt-2">
          <div className="divide-y divide-stone-100">
            {hole.shots.map((shot, i) => (
              <ShotRow
                key={shot.id}
                shot={shot}
                index={i}
                onChange={(s) => updateShot(shot.id, s)}
                onDelete={() => deleteShot(shot.id)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={addShot}
            className="mt-2 w-full rounded-xl border border-dashed border-stone-300 py-2.5 text-sm text-stone-500 active:bg-stone-50"
          >
            + 샷 추가
          </button>

          <textarea
            value={hole.notes}
            onChange={(e) => onChange({ ...hole, notes: e.target.value })}
            placeholder="이 홀 특이사항 (예: 벙커 탈출 2회, 퍼팅 라이 어려움)"
            rows={2}
            className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-cream-50 px-3 py-2 text-sm text-stone-600 placeholder:text-stone-400"
          />
        </div>
      )}
    </div>
  )
}
