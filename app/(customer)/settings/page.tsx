'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TelegramConnect from '@/components/telegram-connect'

export default function SettingsPage() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('telegram_chat_id')
        .eq('id', user.id)
        .single()
      setConnected(!!data?.telegram_chat_id)
    })
  }, [])

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="text-2xl font-bold mb-8">Настройки</h1>
      <Card>
        <CardHeader><CardTitle>Уведомления</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            Подключите Telegram чтобы получать уведомления о новых предложениях от мастеров прямо в мессенджере.
          </p>
          <TelegramConnect connected={connected} />
        </CardContent>
      </Card>
    </div>
  )
}
