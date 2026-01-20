export type EventType = '餵奶' | '擠奶'

export type Settings = {
  feedingIntervalMinutes: number
  pumpingIntervalMinutes: number
}

const STORAGE_KEY = 'babyRecordSettingsV1'

export const DEFAULT_SETTINGS: Settings = {
  feedingIntervalMinutes: 180,
  pumpingIntervalMinutes: 240,
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw) as Partial<Settings>
    return {
      feedingIntervalMinutes:
        typeof parsed.feedingIntervalMinutes === 'number' && parsed.feedingIntervalMinutes > 0
          ? parsed.feedingIntervalMinutes
          : DEFAULT_SETTINGS.feedingIntervalMinutes,
      pumpingIntervalMinutes:
        typeof parsed.pumpingIntervalMinutes === 'number' && parsed.pumpingIntervalMinutes > 0
          ? parsed.pumpingIntervalMinutes
          : DEFAULT_SETTINGS.pumpingIntervalMinutes,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(next: Settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  // notify other tabs / listeners
  window.dispatchEvent(new Event('babyRecordSettingsChanged'))
}

export function formatLocalDateTime(dt: Date, now: Date = new Date()): string {
  const dayMs = 24 * 60 * 60 * 1000
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
  const diffDays = Math.round((target.getTime() - today.getTime()) / dayMs)

  let label: string
  if (diffDays === 0) label = '今日'
  else if (diffDays === -1) label = '昨日'
  else if (diffDays === 1) label = '明日'
  else if (diffDays > 1) label = `${diffDays}天後`
  else label = `${Math.abs(diffDays)}天前`

  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const d = String(dt.getDate()).padStart(2, '0')

  const hour24 = dt.getHours()
  const period = hour24 < 12 ? '上午' : '下午'
  const hour12Raw = hour24 % 12 || 12
  const hh = String(hour12Raw).padStart(2, '0')
  const mm = String(dt.getMinutes()).padStart(2, '0')
  return `${m}/${d}(${label}) ${period} ${hh}:${mm}`
}

export function computeNextTime(
  lastIsoTime: string | null,
  intervalMinutes: number,
): Date | null {
  if (!lastIsoTime) return null
  const base = new Date(lastIsoTime)
  if (Number.isNaN(base.getTime())) return null
  return new Date(base.getTime() + intervalMinutes * 60_000)
}

