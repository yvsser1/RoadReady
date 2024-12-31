import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Moon, Sun, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface HeaderProps {
  darkMode: boolean
  toggleDarkMode: () => void
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
        
        if (!error && data) {
          setCurrentUser({ ...session.user, is_admin: data.is_admin })
        } else {
          setCurrentUser(session.user)
        }
      } else {
        setCurrentUser(null)
      }
    })

    // Initial check
    if (user) {
      checkUserAdmin(user)
    }

    return () => subscription.unsubscribe()
  }, [user])

  const checkUserAdmin = async (user: any) => {
    const { data, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (!error && data) {
      setCurrentUser({ ...user, is_admin: data.is_admin })
    } else {
      setCurrentUser(user)
    }
  }

  const handleLogout = async () => {
    await signOut()
    setCurrentUser(null)
    navigate('/login')
  }

  return (
    <header className="w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="text-2xl font-heading font-bold text-primary hover:opacity-90 transition-opacity"
          >
            RoadReady
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/cars" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Cars
            </Link>
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="mr-2"
                >
                  {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <User className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{currentUser.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {currentUser.is_admin ? 'Admin' : 'User'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Account Settings</Link>
                    </DropdownMenuItem>
                    {currentUser.is_admin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button 
                  asChild 
                  variant="ghost"
                  className="button-hover"
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button 
                  asChild
                  className="button-hover bg-primary hover:bg-primary/90"
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleDarkMode}
                >
                  {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

