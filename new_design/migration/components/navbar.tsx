'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import NotificationsBell from '@/components/notifications-bell'
import type { Profile } from '@/types'

export default function Navbar() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setUserEmail(user.email ?? null)
      supabase.from('profiles').select('*').eq('id', user.id).single()
        .then(({ data }) => setProfile(data))
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  if (!profile) return null

  const isAdmin = userEmail === 'toirovtimurmalik@gmail.com'

  const links = profile.role === 'customer'
    ? [
        { href: '/orders', label: 'Мои заказы' },
        { href: '/orders/new', label: 'Новый заказ' },
        { href: '/masters', label: 'Мастера' },
        { href: '/settings', label: 'Настройки' },
        ...(isAdmin ? [{ href: '/admin', label: 'Админ' }] : []),
      ]
    : [
        { href: '/dashboard', label: 'Лента заказов' },
        { href: '/my-orders', label: 'Мои заказы' },
        { href: '/profile', label: 'Мой профиль' },
      ]

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="px-6 sm:px-10 py-4 flex items-center justify-between max-w-[1400px] mx-auto">
        <Link
          href={profile.role === 'craftsman' ? '/dashboard' : '/orders'}
          className="flex items-baseline gap-2"
        >
          <span className="font-heading text-xl text-foreground tracking-tight">
            Mebel<span className="text-primary italic">Hub</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <NotificationsBell />
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {profile.full_name?.[0] ?? '?'}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground hidden lg:block">{profile.full_name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="hidden sm:inline-flex text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
          >
            Выйти
          </Button>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-primary"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Меню"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card px-6 py-4 space-y-1">
          <div className="flex items-center gap-3 px-2 py-3 mb-2 border-b border-border">
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {profile.full_name?.[0] ?? '?'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-foreground">{profile.full_name}</span>
          </div>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block px-2 py-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left px-2 py-3 text-[11px] uppercase tracking-[0.16em] text-destructive/80 hover:text-destructive mt-2 border-t border-border pt-3"
          >
            Выйти
          </button>
        </div>
      )}
    </nav>
  )
}
