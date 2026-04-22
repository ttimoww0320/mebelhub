'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import TelegramConnect from '@/components/telegram-connect'
import type { Profile } from '@/types'

export default function CraftsmanProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [offers, setOffers] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        setFullName(data.full_name)
        setPhone(data.phone || '')
        setBio(data.bio || '')
      }
      const { data: offersData } = await supabase
        .from('offers')
        .select('*, order:orders(title, status)')
        .eq('craftsman_id', user.id)
        .order('created_at', { ascending: false })
      setOffers(offersData || [])
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('profiles').update({ full_name: fullName, phone, bio }).eq('id', user!.id)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!profile) return <div className="p-10 text-center text-gray-400">Загрузка...</div>

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="w-16 h-16">
          <AvatarFallback className="bg-orange-100 text-orange-700 text-2xl">
            {profile.full_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{profile.full_name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge className="bg-orange-100 text-orange-700">Мастер</Badge>
            {(profile.rating ?? 0) > 0 && (
              <span className="text-sm text-gray-500">★ {profile.rating} ({profile.reviews_count} отзывов)</span>
            )}
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>Редактировать профиль</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Имя и фамилия</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Телефон</Label>
              <Input placeholder="+998 90 123 45 67" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>О себе / Опыт работы</Label>
              <Textarea
                placeholder="Расскажите о себе: опыт, специализация, выполненные работы..."
                rows={4}
                value={bio}
                onChange={e => setBio(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={loading}>
                {saved ? 'Сохранено!' : loading ? 'Сохраняем...' : 'Сохранить'}
              </Button>
              <TelegramConnect connected={!!profile.telegram_chat_id} />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Мои предложения ({offers.length})</CardTitle></CardHeader>
        <CardContent>
          {!offers.length ? (
            <p className="text-gray-400 text-sm">Вы ещё не отправляли предложений</p>
          ) : (
            <div className="space-y-3">
              {offers.map(offer => (
                <div key={offer.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{offer.order?.title}</p>
                    <p className="text-xs text-gray-400">{offer.delivery_days} дней · {Number(offer.price).toLocaleString()} сум</p>
                  </div>
                  <Badge className={
                    offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    offer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-600'
                  }>
                    {offer.status === 'accepted' ? 'Принято' : offer.status === 'rejected' ? 'Отклонено' : 'Ожидает'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
