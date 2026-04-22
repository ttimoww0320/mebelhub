'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TelegramLoginButton from '@/components/telegram-login-button'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') || 'customer'

  const [role, setRole] = useState<'customer' | 'craftsman'>(defaultRole as 'customer' | 'craftsman')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName, role }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Ошибка при регистрации')
      setLoading(false)
      return
    }

    const supabase = createClient()
    await supabase.auth.signInWithPassword({ email, password })

    if (role === 'craftsman') {
      router.push('/dashboard')
    } else {
      router.push('/orders')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link href="/" className="text-orange-600 font-bold text-xl mb-2 block">MebelHub</Link>
          <CardTitle>Создать аккаунт</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={(v) => setRole(v as 'customer' | 'craftsman')} className="mb-6">
            <TabsList className="w-full">
              <TabsTrigger value="customer" className="flex-1">Заказчик</TabsTrigger>
              <TabsTrigger value="craftsman" className="flex-1">Мастер</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Имя и фамилия</Label>
              <Input
                id="fullName"
                placeholder="Алишер Каримов"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Минимум 6 символов"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showPassword ? 'Скрыть' : 'Показать'}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading}>
              {loading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400">или войдите через</span>
            </div>
          </div>

          <div className="flex justify-center">
            <TelegramLoginButton />
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-orange-600 hover:underline">
              Войти
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
