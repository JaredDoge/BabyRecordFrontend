import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Records from './pages/Records'
import Settings from './pages/Settings'
import { useState, useEffect } from 'react'

function App() {
  const [caregiverId, setCaregiverId] = useState<string | null>(
    localStorage.getItem('caregiverId')
  )
  const [caregiverName, setCaregiverName] = useState<string | null>(
    localStorage.getItem('caregiverName')
  )

  useEffect(() => {
    if (caregiverId) {
      localStorage.setItem('caregiverId', caregiverId)
    } else {
      localStorage.removeItem('caregiverId')
    }
  }, [caregiverId])

  useEffect(() => {
    if (caregiverName) {
      localStorage.setItem('caregiverName', caregiverName)
    } else {
      localStorage.removeItem('caregiverName')
    }
  }, [caregiverName])

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              onLogin={(id, name) => {
                setCaregiverId(id)
                setCaregiverName(name)
              }}
            />
          }
        />
        <Route
          path="/records"
          element={
            caregiverId ? (
              <Records
                caregiverId={caregiverId}
                caregiverName={caregiverName || ''}
                onLogout={() => {
                  setCaregiverId(null)
                  setCaregiverName(null)
                }}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/settings"
          element={caregiverId ? <Settings /> : <Navigate to="/login" replace />}
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
