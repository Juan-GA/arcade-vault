'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { AVUser, ScoreEntry } from '@/lib/data'

interface SessionContextValue {
  user: AVUser | null
  login: (u: AVUser) => void
  signOut: () => void
  saveScore: (entry: Omit<ScoreEntry, 'at'>) => void
}

const SessionContext = createContext<SessionContextValue>({
  user: null,
  login: () => {},
  signOut: () => {},
  saveScore: () => {},
})

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AVUser | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('av_user')
      if (stored) setUser(JSON.parse(stored))
    } catch {}
  }, [])

  const login = (u: AVUser) => {
    setUser(u)
    localStorage.setItem('av_user', JSON.stringify(u))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('av_user')
  }

  const saveScore = (entry: Omit<ScoreEntry, 'at'>) => {
    try {
      const all: ScoreEntry[] = JSON.parse(localStorage.getItem('av_scores') || '[]')
      all.push({ ...entry, at: Date.now() })
      localStorage.setItem('av_scores', JSON.stringify(all))
    } catch {}
  }

  return (
    <SessionContext.Provider value={{ user, login, signOut, saveScore }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  return useContext(SessionContext)
}
