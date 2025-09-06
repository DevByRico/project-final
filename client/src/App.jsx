import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Sidor
import SelectTime from './pages/SelectTime.jsx'
import DetailsPage from './pages/DetailsPage.jsx'
import ConfirmPage from './pages/ConfirmPage.jsx'
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'))

class ErrorBoundary extends React.Component {
  constructor(props){
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    console.error('UI ErrorBoundary:', error, info)
  }
  render() {
    if (this.state.error) {
      return (
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4">
            <div className="font-semibold mb-1">Ett fel uppstod i UI:t</div>
            <pre className="whitespace-pre-wrap text-sm">{String(this.state.error?.message || this.state.error)}</pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6">
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<SelectTime />} />
              <Route path="/details" element={<DetailsPage />} />
              <Route path="/confirm" element={<ConfirmPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}
