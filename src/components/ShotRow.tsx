import { CLUBS, type Shot, type ShotDirection, type ShotTag } from '../types'

interface Props {
  shot: Shot
  index: number
  onChange: (shot: Shot) => void
  onDelete: () => void
}

const TAG_CYCLE: ShotTag[] = [null, 'OB', 'HZD']

export default function ShotRow({ shot, index, onChange, onDelete }: Props) {
  function setDirection(dir: ShotDirection) {
    onChange({ ...shot, direction: shot.direction === dir ? null : dir })
  }

  function cycleTag() {
    const currentIdx = TAG_CYCLE.indexOf(shot.tag)
    const next = TAG_CYCLE[(currentIdx + 1) % TAG_CYCLE.length]
    onChange({ ...shot, tag: next })
  }

  return (
    <div className="flex items-center gap-2 py-1.5">
      <div className="w-8 shrink-0 text-center text-xs leading-tight text-stone-400">
        {index === 0 ? (
          <span>
            1<br />Tee
          </span>
        ) : (
          <span>{index + 1}</span>
        )}
      </div>

      <select
        value={shot.club ?? ''}
        onChange={(e) => onChange({ ...shot, club: (e.target.value || null) as Shot['club'] })}
        className="min-w-0 flex-[1.3] rounded-lg border border-stone-300 bg-white px-2 py-2 text-base text-stone-700"
      >
        <option value="">Club</option>
        {CLUBS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div className="flex shrink-0 overflow-hidden rounded-lg border border-stone-300 bg-white">
        <button
          type="button"
          onClick={() => setDirection('L')}
          className={
            'px-2 py-2 active:bg-stone-100 ' +
            (shot.direction === 'L' ? 'bg-green-900 text-white' : 'text-stone-400')
          }
          aria-label="왼쪽으로 감"
        >
          ◀
        </button>
        <button
          type="button"
          onClick={() => setDirection('C')}
          className={
            'border-l border-stone-300 px-2 py-2 active:bg-stone-100 ' +
            (shot.direction === 'C' ? 'bg-green-900 text-white' : 'text-stone-400')
          }
          aria-label="똑바로 감"
        >
          ▲
        </button>
        <button
          type="button"
          onClick={() => setDirection('R')}
          className={
            'border-l border-stone-300 px-2 py-2 active:bg-stone-100 ' +
            (shot.direction === 'R' ? 'bg-green-900 text-white' : 'text-stone-400')
          }
          aria-label="오른쪽으로 감"
        >
          ▶
        </button>
      </div>

      <input
        type="number"
        inputMode="numeric"
        placeholder="거리"
        value={shot.distance ?? ''}
        onChange={(e) =>
          onChange({ ...shot, distance: e.target.value === '' ? null : Number(e.target.value) })
        }
        className="w-16 min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-2 py-2 text-center text-base text-stone-700"
      />

      <button
        type="button"
        onClick={cycleTag}
        className={
          'w-12 shrink-0 rounded-lg py-2 text-center text-[11px] font-bold ' +
          (shot.tag === 'OB'
            ? 'bg-[var(--color-tag-ob)] text-white'
            : shot.tag === 'HZD'
              ? 'bg-[var(--color-tag-hzd)] text-white'
              : 'bg-stone-100 text-stone-300')
        }
      >
        {shot.tag ?? '-'}
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="w-6 shrink-0 text-center text-stone-400 active:text-stone-600"
        aria-label="샷 삭제"
      >
        ✕
      </button>
    </div>
  )
}
