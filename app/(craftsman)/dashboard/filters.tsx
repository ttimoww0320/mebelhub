'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const FURNITURE_TYPES = ['Кухня', 'Шкаф-купе', 'Гардероб', 'Кровать', 'Диван', 'Стол', 'Стул', 'Тумба', 'Полки', 'Другое']

export default function Filters() {
  const router = useRouter()
  const params = useSearchParams()

  function update(key: string, value: string) {
    const p = new URLSearchParams(params.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    router.push(`/dashboard?${p.toString()}`)
  }

  function reset() {
    router.push('/dashboard')
  }

  const activeType = params.get('type') || ''
  const budgetMax = params.get('budget') || ''

  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-wrap gap-2">
        {FURNITURE_TYPES.map(type => (
          <button
            key={type}
            onClick={() => update('type', activeType === type ? '' : type)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              activeType === type
                ? 'bg-orange-600 text-white border-orange-600'
                : 'border-gray-300 hover:border-orange-400'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="flex gap-3 items-center">
        <Input
          type="number"
          placeholder="Макс. бюджет (сум)"
          className="w-52"
          defaultValue={budgetMax}
          onChange={e => update('budget', e.target.value)}
        />
        {(activeType || budgetMax) && (
          <Button variant="outline" size="sm" onClick={reset}>Сбросить фильтры</Button>
        )}
      </div>
    </div>
  )
}
