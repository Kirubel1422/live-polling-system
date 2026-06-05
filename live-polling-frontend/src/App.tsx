import { Toaster } from './components/ui'
import { Routes, Route, Navigate } from 'react-router-dom'
import { 
  Dashboard,
  Editor,
  Preview,
  AccountSettings,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  VerifyEmail,
  StartPage,
  JoinPage,
  ParticipantPresentation
} from '@/pages'
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
        <Route path="/forgot-password" element={<GuestGuard><ForgotPassword /></GuestGuard>} />
        <Route path="/reset-password" element={<GuestGuard><ResetPassword /></GuestGuard>} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        {/* Public Routes (Accessible by anyone) */}
        <Route path="/start" element={<GuestGuard><StartPage /></GuestGuard>} />
        <Route path="/start/participant" element={<GuestGuard><JoinPage /></GuestGuard>} />
        <Route path="/participant/presentation/:presentationId" element={<ParticipantPresentation />} />
        <Route path="/preview/:presentationId" element={<Preview />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
