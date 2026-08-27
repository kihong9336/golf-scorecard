import { useEffect, useState } from 'react'
import Header from './components/Header'
import Tabs, { type TabKey } from './components/Tabs'
import HomePage from './pages/HomePage'
import ScorecardPage from './pages/ScorecardPage'
import HistoryPage from './pages/HistoryPage'
import { createEmptyRound, type Round } from './types'
import { loadCurrentRound, loadRounds, saveCurrentRound, saveRounds } from './storage'

export default function App() {
  const [tab, setTab] = useState<TabKey>('home')
  const [currentRound, setCurrentRound] = useState<Round>(() => loadCurrentRound() ?? createEmptyRound())
  const [rounds, setRounds] = useState<Round[]>(() => loadRounds())

  useEffect(() => {
    saveCurrentRound(currentRound)
  }, [currentRound])

  useEffect(() => {
    saveRounds(rounds)
  }, [rounds])

  function handleNewRound() {
    const hasProgress = currentRound.holes.some((h) => h.score !== null)
    if (hasProgress && !confirm('현재 라운드 기록이 저장되지 않았어요. 새 라운드를 시작할까요?')) {
      return
    }
    setCurrentRound(createEmptyRound())
    setTab('scorecard')
  }

  function handleSaveRound() {
    const savedRound: Round = { ...currentRound, savedAt: new Date().toISOString() }
    setRounds((prev) => {
      const exists = prev.some((r) => r.id === savedRound.id)
      const next = exists ? prev.map((r) => (r.id === savedRound.id ? savedRound : r)) : [savedRound, ...prev]
      return next.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    })
    setCurrentRound(savedRound)
    alert('라운드가 저장되었습니다.')
  }

  function handleOpenRound(id: string) {
    const found = rounds.find((r) => r.id === id)
    if (found) {
      setCurrentRound(found)
      setTab('scorecard')
    }
  }

  function handleDeleteRound(id: string) {
    setRounds((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-cream-50">
      <Header holes={currentRound.holes} />
      <Tabs active={tab} onChange={setTab} />

      {tab === 'home' && (
        <HomePage
          currentRound={currentRound}
          rounds={rounds}
          onContinue={() => setTab('scorecard')}
          onNewRound={handleNewRound}
          onOpenRound={handleOpenRound}
        />
      )}

      {tab === 'scorecard' && (
        <ScorecardPage
          round={currentRound}
          onChange={setCurrentRound}
          onNewRound={handleNewRound}
          onSaveRound={handleSaveRound}
        />
      )}

      {tab === 'history' && (
        <HistoryPage rounds={rounds} onOpenRound={handleOpenRound} onDeleteRound={handleDeleteRound} />
      )}
    </div>
  )
}
