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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
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

  const links = profile.role === 'customer'
    ? [
        { href: '/orders', label: 'Мои заказы' },
        { href: '/orders/new', label: '+ Новый заказ' },
        { href: '/masters', label: 'Мастера' },
        { href: '/settings', label: 'Настройки' },
      ]
    : [
        { href: '/dashboard', label: 'Лента заказов' },
        { href: '/profile', label: 'Мой профиль' },
      ]

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link
          href={profile.role === 'craftsman' ? '/dashboard' : '/orders'}
          className="text-orange-600 font-bold text-lg"
        >
          MebelHub
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm text-gray-600 hover:text-gray-900">
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationsBell />
          <div className="hidden sm:flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-orange-100 text-orange-700 text-sm">
                {profile.full_name?.[0] ?? '?'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-700 hidden lg:block">{profile.full_name}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:inline-flex">
            Выйти
          </Button>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Меню"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-1">
          <div className="flex items-center gap-2 px-2 py-2 mb-2 border-b">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-orange-100 text-orange-700 text-sm">
                {profile.full_name?.[0] ?? '?'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700">{profile.full_name}</span>
          </div>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block px-2 py-2.5 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md"
            >
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left px-2 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-md mt-1"
          >
            Выйти
          </button>
        </div>
      )}
    </nav>
  )
}
