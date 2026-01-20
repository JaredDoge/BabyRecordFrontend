import './ActionButtons.css'

interface ActionButtonsProps {
  onCreateRecord: (event: '餵奶' | '擠奶' | '大便' | '小便') => void
  disabled: boolean
}

function ActionButtons({ onCreateRecord, disabled }: ActionButtonsProps) {
  return (
    <div className="action-buttons-container">
      <button
        className="action-button feeding-button"
        onClick={() => onCreateRecord('餵奶')}
        disabled={disabled}
      >
        餵奶
      </button>
      <button
        className="action-button pumping-button"
        onClick={() => onCreateRecord('擠奶')}
        disabled={disabled}
      >
        擠奶
      </button>
      <button
        className="action-button poop-button"
        onClick={() => onCreateRecord('大便')}
        disabled={disabled}
      >
        大便
      </button>
      <button
        className="action-button pee-button"
        onClick={() => onCreateRecord('小便')}
        disabled={disabled}
      >
        小便
      </button>
    </div>
  )
}

export default ActionButtons
