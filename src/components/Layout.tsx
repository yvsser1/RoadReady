import { ReactNode, useState, useEffect } from 'react'
import Header from './Header'
import { Button } from './ui/button'
import { Moon, Sun } from 'lucide-react'
import { Toaster } from "./ui/toaster"


interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDarkMode)
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    document.documentElement.classList.toggle('dark', newDarkMode)
  }

  return (
    
  
    <div className="min-h-screen w-full bg-white dark:bg-black text-foreground transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="w-full bg-rose-50 dark:bg-black">
        {children}
      </main>
      <Toaster />
    </div>
  )
}

