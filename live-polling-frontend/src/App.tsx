import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import Dashboard from '@/pages/Dashboard'
import Editor from '@/pages/Editor'
import Preview from '@/pages/Preview'
import AccountSettings from '@/pages/AccountSettings'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/account" element={<AccountSettings />} />
        <Route path="/editor/:presentationId" element={<Editor />} />
        <Route path="/preview/:presentationId" element={<Preview />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
