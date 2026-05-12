'use client'

import { useState } from 'react'

export default function BroadcastForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [target, setTarget] = useState<'all' | 'customers' | 'craftsmen'>('all')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ sent: number } | null>(null)
  const [error, setError] = useState('')

  async function send() {
    if (!title.trim() || !body.trim()) return
    if (!confirm(`Отправить уведомление "${title}" для: ${
      target === 'all' ? 'всех пользователей' :
      target === 'customers' ? 'всех заказчиков' : 'всех мастеров'
    }?`)) return

    setLoading(true)
    setError('')
    setResult(null)

    const res = await fetch('/api/admin/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, target }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Ошибка отправки')
    } else {
      setResult(data)
      setTitle('')
      setBody('')
    }
  }

  const targetLabels = {
    all:       'Всем пользователям',
    customers: 'Только заказчикам',
    craftsmen: 'Только мастерам',
  }

  return (
    <div className="max-w-xl">
      <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col gap-5">

        {/* Target */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Получатели</label>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'customers', 'craftsmen'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTarget(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  target === t
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {targetLabels[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Заголовок</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Например: Новая функция на платформе"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-orange-400"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Текст</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Текст уведомления..."
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-orange-400 resize-none"
          />
        </div>

        {/* Preview */}
        {(title || body) && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="text-xs text-gray-400 mb-2 font-medium">Предпросмотр</div>
            <div className="text-sm font-semibold text-gray-900">{title || '—'}</div>
            <div className="text-sm text-gray-600 mt-1">{body || '—'}</div>
          </div>
        )}

        {/* Result / Error */}
        {result && (
          <div className="bg-green-50 text-green-700 rounded-lg px-4 py-3 text-sm font-medium">
            ✓ Отправлено {result.sent} пользователям
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}

        <button
          onClick={send}
          disabled={loading || !title.trim() || !body.trim()}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Отправка...' : 'Отправить уведомление'}
        </button>
      </div>
    </div>
  )
}
