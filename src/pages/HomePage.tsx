import { HOLES_PLAYED, PLAYED_PAR_TOTAL, SCORE_TOTAL, toParString, type Round } from '../types'

interface Props {
  currentRound: Round
  rounds: Round[]
  onContinue: () => void
  onNewRound: () => void
  onOpenRound: (id: string) => void
}

export default function HomePage({ currentRound, rounds, onContinue, onNewRound, onOpenRound }: Props) {
  const played = HOLES_PLAYED(currentRound.holes)
  const recent = rounds.slice(0, 3)

  return (
    <div className="space-y-5 px-4 py-5">
      {played > 0 && (
        <button
          type="button"
          onClick={onContinue}
          className="block w-full rounded-2xl bg-green-900 p-4 text-left text-white active:bg-green-800"
        >
          <div className="text-sm text-white/70">진행 중인 라운드</div>
          <div className="mt-1 text-lg font-bold">
            {currentRound.courseName || '이름 없는 코스'} · {played}홀 진행
          </div>
          <div className="mt-1 text-sm text-white/80">
            {SCORE_TOTAL(currentRound.holes)}타 ({toParString(SCORE_TOTAL(currentRound.holes) - PLAYED_PAR_TOTAL(currentRound.holes))})
          </div>
        </button>
      )}

      <button
        type="button"
        onClick={onNewRound}
        className="block w-full rounded-2xl border-2 border-dashed border-green-700/40 p-4 text-center font-semibold text-green-800 active:bg-green-900/5"
      >
        + 새 라운드 시작
      </button>

      <div>
        <div className="mb-2 text-xs font-semibold tracking-wide text-stone-400">최근 라운드</div>
        {recent.length === 0 ? (
          <div className="rounded-2xl bg-white/70 p-4 text-sm text-stone-400">
            아직 저장된 라운드가 없어요.
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((r) => {
              const total = SCORE_TOTAL(r.holes)
              const diff = total - PLAYED_PAR_TOTAL(r.holes)
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onOpenRound(r.id)}
                  className="flex w-full items-center justify-between rounded-2xl bg-white/70 p-4 text-left active:bg-white"
                >
                  <div>
                    <div className="font-semibold text-stone-800">{r.courseName || '이름 없는 코스'}</div>
                    <div className="text-xs text-stone-400">
                      {new Date(r.date).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-stone-800">{total}</div>
                    <div className="text-xs text-stone-400">{toParString(diff)}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
