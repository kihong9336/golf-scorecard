import {
  CLUBS,
  CLUB_LABELS,
  SHOT_SHAPES_BY_GROUP,
  SHOT_SHAPE_LABELS,
  TAG_CYCLE_BY_CATEGORY,
  clubCategory,
  defaultTagForClub,
  shotShapeGroup,
  type Shot,
} from '../types'

interface Props {
  shot: Shot
  index: number
  onChange: (shot: Shot) => void
  onDelete: () => void
}

const TAG_COLOR_CLASS: Record<string, string> = {
  OB: 'bg-[var(--color-tag-ob)] text-white',
  HZD: 'bg-[var(--color-tag-hzd)] text-white',
  FW: 'bg-[var(--color-tag-fw)] text-white',
  BK: 'bg-[var(--color-tag-bk)] text-white',
  GR: 'bg-[var(--color-tag-gr)] text-white',
  RF: 'bg-[var(--color-tag-rf)] text-white',
}

export default function ShotRow({ shot, index, onChange, onDelete }: Props) {
  function handleClubChange(newClub: Shot['club']) {
    const categoryChanged = clubCategory(newClub) !== clubCategory(shot.club)
    const shapeGroupChanged = shotShapeGroup(newClub) !== shotShapeGroup(shot.club)
    onChange({
      ...shot,
      club: newClub,
      tag: categoryChanged ? defaultTagForClub(newClub) : shot.tag,
      shape: shapeGroupChanged ? null : shot.shape,
    })
  }

  function cycleTag() {
    const cycle = TAG_CYCLE_BY_CATEGORY[clubCategory(shot.club)]
    const currentIdx = cycle.indexOf(shot.tag)
    const next = cycle[(currentIdx + 1) % cycle.length]
    onChange({ ...shot, tag: next })
  }

  const shapeOptions = SHOT_SHAPES_BY_GROUP[shotShapeGroup(shot.club)]

  return (
    <div className="py-1.5">
      <div className="flex items-center gap-2">
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
          onChange={(e) => handleClubChange((e.target.value || null) as Shot['club'])}
          className="min-w-0 flex-[1.3] rounded-lg border border-stone-300 bg-white px-2 py-2 text-base text-stone-700"
        >
          <option value="">Club</option>
          {CLUBS.map((c) => (
            <option key={c} value={c}>
              {CLUB_LABELS[c]}
            </option>
          ))}
        </select>

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
            (shot.tag ? TAG_COLOR_CLASS[shot.tag] : 'bg-stone-100 text-stone-300')
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

      <div className="mt-1.5 pl-10">
        <select
          value={shot.shape ?? ''}
          onChange={(e) => onChange({ ...shot, shape: (e.target.value || null) as Shot['shape'] })}
          className="w-full min-w-0 rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-base text-stone-700"
        >
          <option value="">구질</option>
          {shapeOptions.map((s) => (
            <option key={s} value={s}>
              {SHOT_SHAPE_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
