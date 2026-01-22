import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Records from './pages/Records'
import Settings from './pages/Settings'
import { useState, useEffect } from 'react'

function App() {
  const [caregiverName, setCaregiverName] = useState<string | null>(
    localStorage.getItem('caregiverName')
  )

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
            caregiverName ? (
              <Navigate to="/records" replace />
            ) : (
            <Login
              onLogin={(name) => {
                setCaregiverName(name)
              }}
            />
            )
          }
        />
        <Route
          path="/records"
          element={
            caregiverName ? (
              <Records
                caregiverName={caregiverName || ''}
                onLogout={() => {
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
          element={caregiverName ? <Settings /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/"
          element={<Navigate to={caregiverName ? '/records' : '/login'} replace />}
        />
      </Routes>
    </Router>
  )
}

export default App
