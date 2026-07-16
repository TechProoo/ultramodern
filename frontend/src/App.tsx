import { type ReactNode } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { StoreProvider, useStore } from './store'
import type { Session } from './auth'
import Landing from './components/Landing'
import Login from './components/Login'
import AdminApp from './components/admin/AdminApp'
import TechApp from './components/tech/TechApp'
import ClientPortal from './components/client/ClientPortal'

// Full-height flex column that every platform screen renders inside.
function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#1c1c1c' }}>
      <Outlet />
    </div>
  )
}

// Guards a platform route to a single role. A signed-in user on the wrong
// platform is bounced to their own — platforms never connect. A signed-out
// user is sent to the login screen.
function RequireRole({ role, children }: { role: Session['role']; children: ReactNode }) {
  const { session } = useStore()
  if (!session) return <Navigate to="/login" replace />
  if (session.role !== role) return <Navigate to={`/${session.role}`} replace />
  return <>{children}</>
}

// The login screen redirects already-authenticated users straight to their
// platform so they can't sit on /login while signed in.
function LoginRoute() {
  const { session } = useStore()
  if (session) return <Navigate to={`/${session.role}`} replace />
  return <Login />
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/admin" element={<RequireRole role="admin"><AdminApp /></RequireRole>} />
        <Route path="/tech" element={<RequireRole role="tech"><TechApp /></RequireRole>} />
        <Route path="/client" element={<RequireRole role="client"><ClientPortal /></RequireRole>} />
        {/* Unknown paths fall back to the public landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </StoreProvider>
  )
}
