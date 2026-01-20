import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import './Login.css'

interface LoginProps {
  onLogin: (caregiverId: string, caregiverName: string) => void
}

function Login({ onLogin }: LoginProps) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('請輸入照顧者名稱')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await api.login(name.trim())
      onLogin(response.caregiver_id.toString(), name.trim())
      navigate('/records')
    } catch (err: any) {
      setError(err.response?.data?.message || '登入失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>寶寶記錄</h1>
        <p className="subtitle">請輸入照顧者名稱</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="照顧者名稱"
            className="name-input"
            disabled={loading}
            autoFocus
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? '登入中...' : '登入'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
