import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export function SiteHeader() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentUser, setCurrentUser] = useState(user)

  useEffect(() => {
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user)
      setCurrentUser(session?.user ?? null)
      
      // Check admin status if user exists
      if (session?.user) {
        checkAdminStatus(session.user.id)
      } else {
        setIsAdmin(false)
      }
    })

    // Initial admin check
    if (user) {
      checkAdminStatus(user.id)
    }

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  async function checkAdminStatus(userId: string) {
    const { data, error } = await supabase
      .from('admin_roles')
      .select('is_admin')
      .eq('user_id', userId)
      .single()
    
    if (!error && data) {
      setIsAdmin(data.is_admin)
    }
  }

  const handleLogout = async () => {
    await signOut()
    setCurrentUser(null)
    setIsAdmin(false)
    navigate('/login')
  }

  return (
    <header className="w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          DRIVOXE.
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium">
            Home
          </Link>
          <Link to="/cars" className="text-sm font-medium">
            Cars
          </Link>
          <Link to="#" className="text-sm font-medium">
            Pricing
          </Link>
          <Link to="#" className="text-sm font-medium">
            About
          </Link>
          {currentUser && (
            <>
              <Link to="/profile" className="text-sm font-medium">
                Profile
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-sm font-medium">
                  Admin Dashboard
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <Button 
              onClick={handleLogout}
              variant="destructive" 
              className="bg-red-500 hover:bg-red-600"
            >
              Logout
            </Button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-red-500">
                Login
              </Link>
              <Button 
                variant="destructive" 
                className="bg-red-500 hover:bg-red-600"
                asChild
              >
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}