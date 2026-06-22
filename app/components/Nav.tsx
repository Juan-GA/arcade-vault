'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from '@/app/context/session'

export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useSession()
  const [open, setOpen] = useState(false)

  const isHome = pathname === '/'
  const isLibrary = pathname.startsWith('/games')
  const isHall = pathname === '/hall-of-fame'
  const isAuth = pathname === '/auth'

  const close = () => setOpen(false)

  const handleSignOut = () => {
    signOut()
    router.push('/')
    close()
  }

  return (
    <>
      <nav className="av-nav">
        <Link href="/" className="logo" onClick={close}>
          <div className="logo-mark" />
          <div className="logo-text neon-cyan">
            ARCADE <span className="neon-magenta">VAULT</span>
          </div>
        </Link>

        <div className="links">
          <Link href="/" className={isHome ? 'active' : ''}>Inicio</Link>
          <Link href="/games" className={isLibrary ? 'active' : ''}>Biblioteca</Link>
          <Link href="/hall-of-fame" className={isHall ? 'active' : ''}>Salón de la Fama</Link>
        </div>

        <div className="spacer" />

        <div className="coin-counter">
          <span className="coin" />
          <span>CRÉDITOS · 03</span>
        </div>

        {user ? (
          <button className="btn ghost auth-btn" onClick={handleSignOut}>
            {user.name} ▾
          </button>
        ) : (
          <Link href="/auth" className="btn auth-btn">Iniciar Sesión</Link>
        )}

        <button
          className="btn ghost hamburger"
          onClick={() => setOpen(true)}
          aria-label="Menú"
        >
          ≡
        </button>
      </nav>

      <div
        className={`av-mobile-backdrop${open ? ' open' : ''}`}
        onClick={close}
      />
      <aside className={`av-mobile-panel${open ? ' open' : ''}`}>
        <div className="pixel neon-cyan" style={{ fontSize: 11, marginBottom: 16 }}>MENÚ</div>
        <Link href="/" className={isHome ? 'active' : ''} onClick={close}>Inicio</Link>
        <Link href="/games" className={isLibrary ? 'active' : ''} onClick={close}>Biblioteca</Link>
        <Link href="/hall-of-fame" className={isHall ? 'active' : ''} onClick={close}>Salón de la Fama</Link>
        <Link
          href="/auth"
          className={isAuth ? 'active' : ''}
          onClick={close}
        >
          {user ? 'Cuenta' : 'Iniciar Sesión'}
        </Link>
        <div style={{ flex: 1 }} />
        <div className="pixel" style={{ fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.16em' }}>
          CRÉDITOS · 03
        </div>
      </aside>
    </>
  )
}
