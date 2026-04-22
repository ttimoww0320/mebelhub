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
    router.push('/')
    router.refresh()
  }

  if (!profile) return null

  return (
    <nav className="border-b bg-white px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link href={profile.role === 'craftsman' ? '/dashboard' : '/orders'} className="text-orange-600 font-bold text-lg">
          MebelHub
        </Link>
        {profile.role === 'customer' ? (
          <>
            <Link href="/orders" className="text-sm text-gray-600 hover:text-gray-900">Мои заказы</Link>
            <Link href="/orders/new" className="text-sm text-gray-600 hover:text-gray-900">+ Новый заказ</Link>
            <Link href="/settings" className="text-sm text-gray-600 hover:text-gray-900">Настройки</Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Лента заказов</Link>
            <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900">Мой профиль</Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <NotificationsBell />
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-orange-100 text-orange-700 text-sm">
              {profile.full_name?.[0] ?? '?'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-700 hidden sm:block">{profile.full_name}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>Выйти</Button>
      </div>
    </nav>
  )
}
