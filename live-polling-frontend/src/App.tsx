import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import Dashboard from '@/pages/Dashboard'
import Editor from '@/pages/Editor'
import Preview from '@/pages/Preview'
import AccountSettings from '@/pages/AccountSettings'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import { AuthGuard, GuestGuard } from '@/components/auth/AuthGuard'

function App() {
  return (
    <>
      <Routes>
        {/* Protected Routes */}
        <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
        <Route path="/account" element={<AuthGuard><AccountSettings /></AuthGuard>} />
        <Route path="/editor/:presentationId" element={<AuthGuard><Editor /></AuthGuard>} />
        
        {/* Guest Routes (Only accessible when NOT logged in) */}
        <Route path="/login" element={<GuestGuard><Login /></GuestGuard>} />
        <Route path="/register" element={<GuestGuard><Register /></GuestGuard>} />
        
        {/* Public Routes (Accessible by anyone) */}
        <Route path="/preview/:presentationId" element={<Preview />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
