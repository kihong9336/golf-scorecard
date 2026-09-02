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
  const [currentRound, setCurrentRound] = useState<Round>(() => {
    const loaded = loadCurrentRound()
    return loaded ? { ...loaded, status: loaded.status ?? 'active' } : createEmptyRound()
  })
  const [rounds, setRounds] = useState<Round[]>(() => loadRounds())

  useEffect(() => {
    saveCurrentRound(currentRound)
  }, [currentRound])

  useEffect(() => {
    saveRounds(rounds)
  }, [rounds])

  function upsertRound(round: Round) {
    setRounds((prev) => {
      const exists = prev.some((r) => r.id === round.id)
      const next = exists ? prev.map((r) => (r.id === round.id ? round : r)) : [round, ...prev]
      return next.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    })
  }

  function handleNewRound() {
    const hasProgress = currentRound.status === 'active' && currentRound.holes.some((h) => h.score !== null)
    if (hasProgress && !confirm('현재 라운드 기록이 저장되지 않았어요. 새 라운드를 시작할까요?')) {
      return
    }
    setCurrentRound(createEmptyRound())
    setTab('scorecard')
  }

  function handleSaveRound() {
    const savedRound: Round = { ...currentRound, savedAt: new Date().toISOString() }
    upsertRound(savedRound)
    setCurrentRound(savedRound)
    alert('라운드가 저장되었습니다.')
  }

  function handleCloseRound() {
    const closedRound: Round = { ...currentRound, savedAt: new Date().toISOString(), status: 'closed' }
    upsertRound(closedRound)
    setCurrentRound(createEmptyRound())
    setTab('home')
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

  function handleExportRounds() {
    const blob = new Blob([JSON.stringify(rounds, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `golf-scorecard-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleImportRounds(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)
        if (!Array.isArray(parsed)) throw new Error('invalid backup format')
        if (!confirm(`백업 파일에서 라운드 ${parsed.length}개를 불러옵니다. 현재 기록 목록을 덮어쓸까요?`)) return
        setRounds(parsed as Round[])
        alert('가져오기가 완료되었습니다.')
      } catch {
        alert('올바른 백업 파일이 아니에요.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-cream-50">
      <Header />
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
          onSaveRound={handleSaveRound}
          onCloseRound={handleCloseRound}
        />
      )}

      {tab === 'history' && (
        <HistoryPage
          rounds={rounds}
          onOpenRound={handleOpenRound}
          onDeleteRound={handleDeleteRound}
          onExport={handleExportRounds}
          onImport={handleImportRounds}
        />
      )}
    </div>
  )
}
