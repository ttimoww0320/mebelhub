'use client'

import { useEffect, useRef, useState } from 'react'
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

const verificationLabels: Record<string, { label: string; className: string }> = {
  none:     { label: 'Не подан',   className: 'bg-gray-100 text-gray-600' },
  pending:  { label: 'На проверке', className: 'bg-yellow-100 text-yellow-700' },
  verified: { label: 'Проверен ✓', className: 'bg-green-100 text-green-700' },
  rejected: { label: 'Отклонён',   className: 'bg-red-100 text-red-600' },
}

export default function CraftsmanProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [offers, setOffers] = useState<any[]>([])
  const [docFile, setDocFile] = useState<File | null>(null)
  const [docLoading, setDocLoading] = useState(false)
  const [docMsg, setDocMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

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

  async function handleVerificationSubmit() {
    if (!docFile || !profile) return
    setDocLoading(true)
    setDocMsg('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const ext = docFile.name.split('.').pop()
    const path = `${user.id}/doc_${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('verification-docs')
      .upload(path, docFile)

    if (uploadError) {
      setDocMsg('Ошибка загрузки: ' + uploadError.message)
      setDocLoading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('verification-docs').getPublicUrl(path)

    await supabase.from('profiles').update({
      verification_status: 'pending',
      verification_doc_url: urlData.publicUrl,
    }).eq('id', user.id)

    setProfile(prev => prev ? { ...prev, verification_status: 'pending' } : prev)
    setDocMsg('Документ отправлен! Проверка займёт 1-2 дня.')
    setDocFile(null)
    setDocLoading(false)
  }

  if (!profile) return <div className="p-10 text-center text-gray-400">Загрузка...</div>

  const vs = profile.verification_status || 'none'
  const vInfo = verificationLabels[vs]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="w-16 h-16">
          <AvatarFallback className="bg-orange-100 text-orange-700 text-2xl">
            {profile.full_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{profile.full_name}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge className="bg-orange-100 text-orange-700">Мастер</Badge>
            <Badge className={vInfo.className}>{vInfo.label}</Badge>
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

      {/* Verification card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Верификация</CardTitle>
            <Badge className={vInfo.className}>{vInfo.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {vs === 'verified' && (
            <p className="text-sm text-green-700">
              Ваш профиль верифицирован. На публичной странице отображается бейдж "Проверен ✓".
            </p>
          )}
          {vs === 'pending' && (
            <p className="text-sm text-yellow-700">
              Документ на проверке. Мы уведомим вас в Telegram когда проверка будет завершена.
            </p>
          )}
          {vs === 'rejected' && (
            <p className="text-sm text-red-600">
              Документ отклонён. Пожалуйста, загрузите другой документ (паспорт или свидетельство ИП).
            </p>
          )}
          {(vs === 'none' || vs === 'rejected') && (
            <>
              <p className="text-sm text-gray-500">
                Загрузите фото паспорта или свидетельства ИП для получения бейджа "Проверен ✓". Это повышает доверие заказчиков.
              </p>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer hover:border-orange-400 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {docFile ? (
                  <p className="text-sm text-green-600 font-medium">{docFile.name}</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-500">Нажмите чтобы выбрать файл</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG или PDF</p>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={e => setDocFile(e.target.files?.[0] || null)}
                />
              </div>
              {docMsg && (
                <p className="text-sm text-green-600">{docMsg}</p>
              )}
              <Button
                onClick={handleVerificationSubmit}
                disabled={!docFile || docLoading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {docLoading ? 'Отправляем...' : 'Отправить на проверку'}
              </Button>
            </>
          )}
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
