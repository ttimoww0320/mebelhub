'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    let channelName: string

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      setNotifications(data || [])

      channelName = `notifications-${user.id}`
      const existing = supabase.getChannels().find(c => c.topic === `realtime:${channelName}`)
      if (existing) supabase.removeChannel(existing)

      supabase.channel(channelName)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          setNotifications(prev => [payload.new as any, ...prev])
        })
        .subscribe()
    }

    load()

    return () => {
      if (channelName) {
        const existing = supabase.getChannels().find(c => c.topic === `realtime:${channelName}`)
        if (existing) supabase.removeChannel(existing)
      }
    }
  }, [])

  async function markAllRead() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open) markAllRead() }}
        className="relative p-2 text-gray-500 hover:text-gray-900"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-80 bg-white border rounded-xl shadow-lg z-50">
          <div className="p-3 border-b font-medium text-sm">Уведомления</div>
          <div className="max-h-80 overflow-y-auto">
            {!notifications.length ? (
              <p className="text-sm text-gray-400 text-center py-6">Нет уведомлений</p>
            ) : (
              notifications.map(n => (
                <Link
                  key={n.id}
                  href={n.link || '#'}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 hover:bg-gray-50 border-b last:border-0 ${!n.read ? 'bg-orange-50' : ''}`}
                >
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
