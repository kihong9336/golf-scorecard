import { PLAYED_PAR_TOTAL, SCORE_TOTAL, toParString, type Round } from '../types'

interface Props {
  rounds: Round[]
  onOpenRound: (id: string) => void
  onDeleteRound: (id: string) => void
}

export default function HistoryPage({ rounds, onOpenRound, onDeleteRound }: Props) {
  if (rounds.length === 0) {
    return (
      <div className="px-4 py-10 text-center text-sm text-stone-400">
        저장된 라운드가 없어요. Scorecard 탭에서 라운드를 저장해보세요.
      </div>
    )
  }

  return (
    <div className="space-y-2 px-4 py-4">
      {rounds.map((r) => {
        const total = SCORE_TOTAL(r.holes)
        const diff = total - PLAYED_PAR_TOTAL(r.holes)
        return (
          <div key={r.id} className="flex items-center gap-2 rounded-2xl bg-white/70 p-4">
            <button type="button" onClick={() => onOpenRound(r.id)} className="min-w-0 flex-1 text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-stone-800">{r.courseName || '이름 없는 코스'}</span>
                {r.status === 'active' && (
                  <span className="rounded-full bg-green-900/10 px-1.5 py-0.5 text-[10px] font-semibold text-green-800">
                    진행중
                  </span>
                )}
              </div>
              <div className="text-xs text-stone-400">
                {new Date(r.date).toLocaleDateString('ko-KR')}
              </div>
            </button>
            <div className="text-right">
              <div className="text-lg font-bold text-stone-800">{total}</div>
              <div className="text-xs text-stone-400">{toParString(diff)}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('이 라운드를 삭제할까요?')) onDeleteRound(r.id)
              }}
              className="ml-1 text-stone-300 active:text-red-500"
              aria-label="라운드 삭제"
            >
              ✕
            </button>
          </div>
        )
      })}
    </div>
  )
}
