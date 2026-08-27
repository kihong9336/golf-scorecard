export type TabKey = 'home' | 'scorecard' | 'history'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'scorecard', label: 'Scorecard' },
  { key: 'history', label: 'History' },
]

interface Props {
  active: TabKey
  onChange: (tab: TabKey) => void
}

export default function Tabs({ active, onChange }: Props) {
  return (
    <div className="flex border-b border-stone-200 bg-cream-50">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={
            'flex-1 py-3 text-center text-[15px] font-medium transition-colors ' +
            (active === tab.key
              ? 'border-b-2 border-green-700 text-green-800'
              : 'text-stone-400')
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
