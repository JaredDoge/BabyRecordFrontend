import { useState, useEffect } from 'react'
import { api, Record, type RecordEvent } from '../api/client'
import { computeNextTime, formatLocalDateTime, loadSettings, type Settings } from '../utils/settings'
import { useNavigate } from 'react-router-dom'
import RecordItem from '../components/RecordItem'
import ActionButtons from '../components/ActionButtons'
import EditModal from '../components/EditModal'
import './Records.css'

interface RecordsProps {
  caregiverName: string
  onLogout: () => void
}

function Records({ caregiverName, onLogout }: RecordsProps) {
  const navigate = useNavigate()
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)
  const [editingRecord, setEditingRecord] = useState<Record | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [settings, setSettings] = useState<Settings>(() => loadSettings())

  useEffect(() => {
    const onChanged = () => setSettings(loadSettings())
    window.addEventListener('babyRecordSettingsChanged', onChanged)
    window.addEventListener('storage', onChanged)
    return () => {
      window.removeEventListener('babyRecordSettingsChanged', onChanged)
      window.removeEventListener('storage', onChanged)
    }
  }, [])

  const fetchRecords = async (isSilent = false) => {
    if (!isSilent) setLoading(true)
    try {
      const data = await api.getRecords()
      const sorted = data.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      setRecords(sorted)
    } catch (err) {
      console.error('Failed to fetch records:', err)
    } finally {
      if (!isSilent) setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchRecords()

    // Auto refresh logic
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchRecords(true)
      }
    }, 30000) // Refresh every 30 seconds if visible

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchRecords(true)
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  const handleCreateRecord = async (event: RecordEvent) => {
    setRefreshing(true)
    try {
      await api.createRecord({
        caregiver_name: caregiverName,
        time: new Date().toISOString(),
        event,
      })
      await fetchRecords()
    } catch (err) {
      console.error('Failed to create record:', err)
      alert('新增記錄失敗，請稍後再試')
      setRefreshing(false)
    }
  }

  const handleEdit = (record: Record) => {
    setEditingRecord(record)
  }

  const handleDelete = async (recordId: number) => {
    setRefreshing(true)
    try {
      await api.deleteRecord(recordId)
      setEditingRecord(null)
      await fetchRecords()
    } catch (err) {
      console.error('Failed to delete record:', err)
      alert('刪除記錄失敗，請稍後再試')
      setRefreshing(false)
    }
  }

  const handleUpdate = async (recordId: number, time: string, event: RecordEvent, notes?: string) => {
    setRefreshing(true)
    try {
      await api.updateRecord({
        record_id: recordId,
        time,
        event,
        notes,
      })
      setEditingRecord(null)
      await fetchRecords()
    } catch (err) {
      console.error('Failed to update record:', err)
      alert('更新記錄失敗，請稍後再試')
      setRefreshing(false)
    }
  }

  const handleCloseModal = () => {
    setEditingRecord(null)
  }

  const lastFeeding = records.find((r) => r.event === '餵奶')?.time ?? null
  const lastPumping = records.find((r) => r.event === '擠奶')?.time ?? null
  const nextFeeding = computeNextTime(lastFeeding, settings.feedingIntervalMinutes)
  const nextPumping = computeNextTime(lastPumping, settings.pumpingIntervalMinutes)

  return (
    <div className="records-container">
      <header className="records-header">
        <h1>寶寶記錄</h1>
        <div className="header-info">
          <span className="caregiver-name">{caregiverName}</span>
          <button onClick={() => navigate('/settings')} className="logout-button">
            設定
          </button>
          <button onClick={onLogout} className="logout-button">
            登出
          </button>
        </div>
      </header>

      <main className="records-main">
        <div className="next-times">
          <div className="next-card next-feeding">
            <div className="next-title">下次餵奶</div>
            <div className="next-time">
              {nextFeeding ? formatLocalDateTime(nextFeeding) : '尚無餵奶記錄'}
            </div>
          </div>
          <div className="next-card next-pumping">
            <div className="next-title">下次擠奶</div>
            <div className="next-time">
              {nextPumping ? formatLocalDateTime(nextPumping) : '尚無擠奶記錄'}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">載入中...</div>
        ) : records.length === 0 ? (
          <div className="empty-state">尚無記錄</div>
        ) : (
          <div className="records-list">
            {records.map((record) => (
              <RecordItem
                key={record.record_id}
                record={record}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </main>

      <ActionButtons
        onCreateRecord={handleCreateRecord}
        disabled={refreshing}
      />

      {editingRecord && (
        <EditModal
          record={editingRecord}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default Records
