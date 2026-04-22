'use client'

import { useState } from 'react'
import Chat from './chat'

export default function ChatToggle({ orderId, currentUserId }: { orderId: string; currentUserId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-4 border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
      >
        <span className="flex items-center gap-2">
          💬 Чат с {open ? '' : '— нажмите чтобы открыть'}
          {!open && <span className="text-gray-400 font-normal">мастером / заказчиком</span>}
          {open && <span className="text-gray-500 font-normal">мастером / заказчиком</span>}
        </span>
        <span className="text-gray-400 text-lg">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t">
          <Chat orderId={orderId} currentUserId={currentUserId} />
        </div>
      )}
    </div>
  )
}
