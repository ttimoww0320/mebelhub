'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function Chat({ orderId, currentUserId }: { orderId: string; currentUserId: string }) {
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase
      .from('messages')
      .select('*, sender:profiles!sender_id(full_name)')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true })
      .then(({ data }) => setMessages(data || []))

    const channel = supabase
      .channel(`chat-${orderId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `order_id=eq.${orderId}`,
      }, async (payload) => {
        const { data } = await supabase
          .from('messages')
          .select('*, sender:profiles!sender_id(full_name)')
          .eq('id', payload.new.id)
          .single()
        if (data) setMessages(prev => [...prev, data])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [orderId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)

    const supabase = createClient()
    await supabase.from('messages').insert({
      order_id: orderId,
      sender_id: currentUserId,
      body: text.trim(),
    })

    setText('')
    setLoading(false)
  }

  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b font-medium text-sm">Чат по заказу</div>
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {!messages.length ? (
          <p className="text-center text-gray-400 text-sm py-8">Начните общение</p>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex gap-2 ${msg.sender_id === currentUserId ? 'flex-row-reverse' : ''}`}>
              <Avatar className="w-7 h-7 shrink-0">
                <AvatarFallback className="text-xs bg-orange-100 text-orange-700">
                  {msg.sender?.full_name?.[0] ?? '?'}
                </AvatarFallback>
              </Avatar>
              <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
                msg.sender_id === currentUserId
                  ? 'bg-orange-600 text-white rounded-tr-none'
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}>
                {msg.body}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2 p-3 border-t">
        <Input
          placeholder="Написать сообщение..."
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={loading || !text.trim()}>
          Отправить
        </Button>
      </form>
    </div>
  )
}
