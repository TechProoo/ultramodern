import { StoreProvider, useStore } from './store'
import Landing from './components/Landing'
import Login from './components/Login'
import AdminApp from './components/admin/AdminApp'
import TechApp from './components/tech/TechApp'
import ClientPortal from './components/client/ClientPortal'

// Each signed-in role is its own self-contained platform — there is no shared
// navigation between them. The only way to move between admin / technician /
// client is to sign out and sign in under a different account.
function Shell() {
  const { role } = useStore()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#1c1c1c' }}>
      {role === 'landing' && <Landing />}
      {role === 'login' && <Login />}
      {role === 'admin' && <AdminApp />}
      {role === 'tech' && <TechApp />}
      {role === 'client' && <ClientPortal />}
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
