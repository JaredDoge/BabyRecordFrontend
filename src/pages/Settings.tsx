import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import './Settings.css'

interface SettingsProps {
  caregiverName: string
}

function Settings({ caregiverName }: SettingsProps) {
  const navigate = useNavigate()
  const [feedingIntervalMinutes, setFeedingIntervalMinutes] = useState<number>(180)
  const [pumpingIntervalMinutes, setPumpingIntervalMinutes] = useState<number>(240)
  const [lastModified, setLastModified] = useState<{ name: string; time: string } | null>(null)
  const [savedMsg, setSavedMsg] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const s = await api.getSettings()
        setFeedingIntervalMinutes(s.feeding_interval)
        setPumpingIntervalMinutes(s.pumping_interval)
        if (s.last_modified_by && s.updated_at) {
          setLastModified({ name: s.last_modified_by, time: s.updated_at })
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const onSave = async () => {
    try {
      await api.updateSettings(caregiverName, {
        feeding_interval: Math.max(1, Math.floor(feedingIntervalMinutes || 0)),
        pumping_interval: Math.max(1, Math.floor(pumpingIntervalMinutes || 0)),
      })

      // Update local state for immediate feedback
      setLastModified({ name: caregiverName, time: new Date().toISOString() })

      setSavedMsg('已儲存')
      setTimeout(() => setSavedMsg(''), 1200)
    } catch (err) {
      console.error('Failed to save settings:', err)
      alert('儲存失敗')
    }
  }

  return (
    <div className="settings-container">
      <header className="settings-header">
        <button className="settings-back" onClick={() => navigate('/records')}>
          ← 返回
        </button>
        <h1>設定</h1>
        <div className="last-modified">
          {lastModified && (
            <>
              最後修改: {lastModified.name}<br />
              {new Date(lastModified.time).toLocaleString('zh-TW', { hour12: false })}
            </>
          )}
        </div>
      </header>

      <main className="settings-main">
        {loading ? (
          <div className="loading">載入中...</div>
        ) : (
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
        )}
      </main>
    </div>
  )
}

export default Settings

