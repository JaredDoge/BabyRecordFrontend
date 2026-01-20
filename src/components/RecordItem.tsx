import { Record } from '../api/client'
import { formatLocalDateTime } from '../utils/settings'
import './RecordItem.css'

interface RecordItemProps {
  record: Record
  onEdit: (record: Record) => void
}

function RecordItem({ record, onEdit }: RecordItemProps) {
  const isFeeding = record.event === '餵奶'
  const isPumping = record.event === '擠奶'
  const isPoop = record.event === '大便'
  const isPee = record.event === '小便'

  let eventClass = ''
  if (isFeeding) eventClass = 'record-feeding'
  else if (isPumping) eventClass = 'record-pumping'
  else if (isPoop) eventClass = 'record-poop'
  else if (isPee) eventClass = 'record-pee'

  const formatted = formatLocalDateTime(new Date(record.time))

  return (
    <div
      className={`record-item ${eventClass}`}
      onClick={() => onEdit(record)}
    >
      <div className="record-content">
        <div className="record-summary">
          <span className="summary-event">{record.event}</span>
          <span className="summary-time">{formatted}</span>
        </div>
      </div>
      <div className="record-caretaker">{record.caregiver_name}</div>
    </div>
  )
}

export default RecordItem
