'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function TelegramLoginButton() {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!ref.current) return

    // Expose callback to window
    ;(window as any).onTelegramAuth = async (user: any) => {
      const res = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Ошибка входа через Telegram')
        return
      }

      // Sign in via magic link
      const supabase = createClient()
      const url = new URL(data.magic_link)
      const token_hash = url.searchParams.get('token_hash') || url.searchParams.get('token')
      const type = url.searchParams.get('type') as any

      if (token_hash) {
        await supabase.auth.verifyOtp({ token_hash, type: 'magiclink' })
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.userId)
        .single()

      if (profile?.role === 'craftsman') {
        router.push('/dashboard')
      } else {
        router.push('/orders')
      }
    }

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', 'Mebel_Hubb_Bot')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    script.async = true
    ref.current.appendChild(script)

    return () => {
      delete (window as any).onTelegramAuth
    }
  }, [])

  return <div ref={ref} />
}
