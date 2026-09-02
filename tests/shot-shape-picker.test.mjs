import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const types = readFileSync(new URL('../src/types.ts', import.meta.url), 'utf8')
const shotRow = readFileSync(new URL('../src/components/ShotRow.tsx', import.meta.url), 'utf8')
const header = readFileSync(new URL('../src/components/Header.tsx', import.meta.url), 'utf8')
const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8')
const scorecard = readFileSync(new URL('../src/pages/ScorecardPage.tsx', import.meta.url), 'utf8')

const compactLabels = {
  STRAIGHT: 'ST', DRAW: 'DR', FADE: 'FD', SLICE: 'SL', HOOK: 'HK',
  PUSH: 'PS', PULL: 'PL', TOP: 'TP', FAT: 'FT', SHANK: 'SK',
  GOOD: 'Gd', L_LONG: 'LL', L_SHORT: 'LS', R_LONG: 'RL', R_SHORT: 'RS',
  M_LONG: 'ML', M_SHORT: 'MS',
}

const fullLabels = {
  STRAIGHT: '스트레이트', DRAW: '드로우', FADE: '페이드', SLICE: '슬라이스', HOOK: '훅',
  PUSH: '푸쉬', PULL: '풀', TOP: '탑볼', FAT: '뒷땅', SHANK: '생크',
  GOOD: 'Good', L_LONG: 'L-long', L_SHORT: 'L-short', R_LONG: 'R-long', R_SHORT: 'R-short',
  M_LONG: 'M-long', M_SHORT: 'M-short',
}

function readLabelMap(source, exportName) {
  const match = source.match(new RegExp(`export const ${exportName}[^=]*= \\{([\\s\\S]*?)\\n\\}`))
  assert.ok(match, `${exportName} must be exported`)
  return Object.fromEntries(
    [...match[1].matchAll(/([A-Z_]+):\s*'([^']+)'/g)].map(([, key, value]) => [key, value]),
  )
}

test('shot shapes keep exact compact labels after selection', () => {
  assert.deepEqual(readLabelMap(types, 'SHOT_SHAPE_LABELS'), compactLabels)
})

test('shot-shape choices expose the exact full labels while selecting', () => {
  assert.deepEqual(readLabelMap(types, 'SHOT_SHAPE_OPTION_LABELS'), fullLabels)
  assert.match(shotRow, /onPointerDown=.*setShapePickerOpen\(true\)/)
  assert.match(shotRow, /onFocus=.*setShapePickerOpen\(true\)/)
  assert.match(shotRow, /onBlur=.*setShapePickerOpen\(false\)/)
  assert.match(shotRow, /shapePickerOpen\s*\?\s*SHOT_SHAPE_OPTION_LABELS\[s\]\s*:\s*SHOT_SHAPE_LABELS\[s\]/)
})

test('running score lives in the OUT/IN summary instead of the header', () => {
  assert.doesNotMatch(header, /SCORE_TOTAL|PLAYED_PAR_TOTAL|toParString/)
  assert.match(app, /<Header\s*\/>/)
  assert.match(scorecard, /<div className="text-xs text-stone-400">Total<\/div>/)
  assert.match(scorecard, /\{SCORE_TOTAL\(round\.holes\) \|\| 0\}/)
  assert.doesNotMatch(scorecard, /PAR_TOTAL|const par/)
})
