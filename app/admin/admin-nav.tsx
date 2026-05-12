'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin',              label: 'Статистика',    icon: '📊' },
  { href: '/admin/users',        label: 'Пользователи',  icon: '👥' },
  { href: '/admin/orders',       label: 'Заказы',        icon: '📋' },
  { href: '/admin/verification', label: 'Верификация',   icon: '✅' },
  { href: '/admin/reviews',      label: 'Отзывы',        icon: '⭐' },
  { href: '/admin/broadcast',    label: 'Рассылка',      icon: '📣' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-0.5 p-3 flex-1">
      {links.map(({ href, label, icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active
                ? 'bg-orange-50 text-orange-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="text-base">{icon}</span>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
