'use client'

import { useEffect, useRef } from 'react'

export default function TelegramLoginButton() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

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

      // Redirect to magic link — Supabase sets session and redirects back
      window.location.href = data.magic_link
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
