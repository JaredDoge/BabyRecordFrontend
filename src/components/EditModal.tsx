import { useState, useEffect } from 'react'
import { Record } from '../api/client'
import './EditModal.css'

interface EditModalProps {
  record: Record
  onUpdate: (recordId: number, time: string, event: '餵奶' | '擠奶' | '大便' | '小便', notes?: string) => void
  onDelete: (recordId: number) => void
  onClose: () => void
}

function EditModal({ record, onUpdate, onDelete, onClose }: EditModalProps) {
  const [time, setTime] = useState('')
  const [event, setEvent] = useState<'餵奶' | '擠奶' | '大便' | '小便'>(record.event)
  const [notes, setNotes] = useState(record.notes || '')

  useEffect(() => {
    const date = new Date(record.time)
    const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    setTime(localDateTime)
    setNotes(record.notes || '')
  }, [record])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!time) {
      alert('請選擇時間')
      return
    }
    const isoTime = new Date(time).toISOString()
    onUpdate(record.record_id, isoTime, event, notes)
  }

  const handleDelete = () => {
    if (!confirm('確定要刪除這筆記錄嗎？')) return
    onDelete(record.record_id)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>編輯記錄</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>時間</label>
            <input
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>事件</label>
            <div className="event-buttons">
              <button
                type="button"
                className={`event-button ${event === '餵奶' ? 'active feeding' : ''}`}
                onClick={() => setEvent('餵奶')}
              >
                餵奶
              </button>
              <button
                type="button"
                className={`event-button ${event === '擠奶' ? 'active pumping' : ''}`}
                onClick={() => setEvent('擠奶')}
              >
                擠奶
              </button>
              <button
                type="button"
                className={`event-button ${event === '大便' ? 'active poop' : ''}`}
                onClick={() => setEvent('大便')}
              >
                大便
              </button>
              <button
                type="button"
                className={`event-button ${event === '小便' ? 'active pee' : ''}`}
                onClick={() => setEvent('小便')}
              >
                小便
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>備註</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="輸入備註內容..."
              rows={3}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="delete-in-modal-button" onClick={handleDelete}>
              刪除
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="save-button">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditModal
