import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(true)

  useEffect(() => {
    async function checkAdminStatus() {
      if (user) {
        const { data, error } = await supabase
          .from('admin_roles')
          .select('is_admin')
          .eq('user_id', user.id)
          .single()

        if (!error && data) {
          setIsAdmin(data.is_admin)
        }
      }
      setCheckingAdmin(false)
    }

    checkAdminStatus()
  }, [user])

  // Show loading state while checking auth
  if (loading || (adminOnly && checkingAdmin)) {
    return <div>Loading...</div>
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check admin access
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

