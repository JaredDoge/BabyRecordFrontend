import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from '../utils/settings'
import './Settings.css'

function Settings() {
  const navigate = useNavigate()
  const [feedingIntervalMinutes, setFeedingIntervalMinutes] = useState<number>(
    DEFAULT_SETTINGS.feedingIntervalMinutes,
  )
  const [pumpingIntervalMinutes, setPumpingIntervalMinutes] = useState<number>(
    DEFAULT_SETTINGS.pumpingIntervalMinutes,
  )
  const [savedMsg, setSavedMsg] = useState<string>('')

  useEffect(() => {
    const s = loadSettings()
    setFeedingIntervalMinutes(s.feedingIntervalMinutes)
    setPumpingIntervalMinutes(s.pumpingIntervalMinutes)
  }, [])

  const onSave = () => {
    const next = {
      feedingIntervalMinutes: Math.max(1, Math.floor(feedingIntervalMinutes || 0)),
      pumpingIntervalMinutes: Math.max(1, Math.floor(pumpingIntervalMinutes || 0)),
    }
    saveSettings(next)
    setSavedMsg('已儲存')
    setTimeout(() => setSavedMsg(''), 1200)
  }

  return (
    <div className="settings-container">
      <header className="settings-header">
        <button className="settings-back" onClick={() => navigate('/records')}>
          ← 返回
        </button>
        <h1>設定</h1>
        <div className="settings-spacer" />
      </header>

      <main className="settings-main">
        <div className="settings-card">
          <h2>間隔（分鐘）</h2>

          <label className="settings-field">
            <div className="settings-label">餵奶間隔</div>
            <input
              type="number"
              min={1}
              value={feedingIntervalMinutes}
              onChange={(e) => setFeedingIntervalMinutes(parseInt(e.target.value || '0', 10))}
            />
          </label>

          <label className="settings-field">
            <div className="settings-label">擠奶間隔</div>
            <input
              type="number"
              min={1}
              value={pumpingIntervalMinutes}
              onChange={(e) => setPumpingIntervalMinutes(parseInt(e.target.value || '0', 10))}
            />
          </label>

          <div className="settings-actions">
            <button className="settings-save" onClick={onSave}>
              儲存
            </button>
            <span className="settings-saved">{savedMsg}</span>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Settings

