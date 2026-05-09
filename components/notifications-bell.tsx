'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { G, BG2, BORDER, BORDER2, TEXT, DIM, MUTE } from '@/lib/tokens'

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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

      channelName = `notifications-bell-${user.id}`
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
        const ch = supabase.getChannels().find(c => c.topic === `realtime:${channelName}`)
        if (ch) supabase.removeChannel(ch)
      }
    }
  }, [])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  async function markAllRead() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unread = notifications.filter(n => !n.read).length

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => { setOpen(o => !o); if (!open) markAllRead() }}
        aria-label="Уведомления"
        style={{
          position: 'relative', background: 'none', border: 'none',
          cursor: 'pointer', padding: '4px 6px', color: unread > 0 ? G : DIM,
          display: 'flex', alignItems: 'center',
        }}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 1, right: 1,
            width: 15, height: 15, borderRadius: '50%',
            background: '#ef4444', color: '#fff',
            fontSize: 9, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)',
          width: 300, background: BG2,
          border: `1px solid ${BORDER2}`,
          borderRadius: 6, zIndex: 50,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            padding: '10px 14px', borderBottom: `1px solid ${BORDER}`,
            fontSize: 12, letterSpacing: '0.08em', color: DIM, fontWeight: 500,
          }}>
            УВЕДОМЛЕНИЯ
          </div>
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {!notifications.length ? (
              <p style={{ fontSize: 13, color: MUTE, textAlign: 'center', padding: '24px 0' }}>
                Нет уведомлений
              </p>
            ) : (
              notifications.map(n => (
                <Link
                  key={n.id}
                  href={n.link || '#'}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'block', padding: '12px 14px',
                    borderBottom: `1px solid ${BORDER}`,
                    textDecoration: 'none',
                    background: !n.read ? 'rgba(228,182,104,0.06)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(228,182,104,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.background = !n.read ? 'rgba(228,182,104,0.06)' : 'transparent')}
                >
                  {!n.read && (
                    <span style={{
                      display: 'inline-block', width: 5, height: 5,
                      borderRadius: '50%', background: G,
                      marginRight: 6, verticalAlign: 'middle', marginTop: -2,
                    }} />
                  )}
                  <span style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>{n.title}</span>
                  <p style={{ fontSize: 12, color: DIM, marginTop: 2, marginBottom: 0 }}>{n.body}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
