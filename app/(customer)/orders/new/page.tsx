'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const FURNITURE_TYPES = ['Кухня', 'Шкаф-купе', 'Гардероб', 'Кровать', 'Диван', 'Стол', 'Стул', 'Тумба', 'Полки', 'Другое']
const STYLES = ['Современный', 'Классический', 'Минимализм', 'Скандинавский', 'Лофт', 'Восточный']

export default function NewOrderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const [form, setForm] = useState({
    title: '',
    description: '',
    furniture_type: '',
    style: '',
    width_cm: '',
    height_cm: '',
    depth_cm: '',
    budget_min: '',
    budget_max: '',
    material: '',
    color: '',
    deadline: '',
  })

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 5)
    setImages(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    // Upload images
    const imageUrls: string[] = []
    for (const file of images) {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('order-images')
        .upload(path, file)
      if (uploadError) {
        setError(`Ошибка загрузки фото: ${uploadError.message}`)
        setLoading(false)
        return
      }
      const { data: urlData } = supabase.storage.from('order-images').getPublicUrl(path)
      imageUrls.push(urlData.publicUrl)
    }

    const { data, error } = await supabase.from('orders').insert({
      customer_id: user.id,
      title: form.title,
      description: form.description,
      furniture_type: form.furniture_type,
      style: form.style || null,
      width_cm: form.width_cm ? Number(form.width_cm) : null,
      height_cm: form.height_cm ? Number(form.height_cm) : null,
      depth_cm: form.depth_cm ? Number(form.depth_cm) : null,
      budget_min: form.budget_min ? Number(form.budget_min) : null,
      budget_max: form.budget_max ? Number(form.budget_max) : null,
      material: form.material || null,
      color: form.color || null,
      deadline: form.deadline || null,
      images: imageUrls,
    }).select().single()

    if (error) {
      setError('Ошибка при создании заказа')
      setLoading(false)
      return
    }

    router.push(`/orders/${data.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="text-2xl font-bold mb-8">Новый заказ</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        <Card>
          <CardHeader><CardTitle>Основная информация</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Название заказа *</Label>
              <Input placeholder="Кухонный гарнитур в современном стиле" value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Тип мебели *</Label>
              <div className="flex flex-wrap gap-2">
                {FURNITURE_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => set('furniture_type', type)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      form.furniture_type === type
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'border-gray-300 hover:border-orange-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Описание и требования *</Label>
              <Textarea
                placeholder="Опишите подробно: что хотите, какие материалы предпочитаете, особые пожелания..."
                rows={4}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Размеры (в см)</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Ширина</Label>
                <Input type="number" placeholder="200" value={form.width_cm} onChange={e => set('width_cm', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Высота</Label>
                <Input type="number" placeholder="220" value={form.height_cm} onChange={e => set('height_cm', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Глубина</Label>
                <Input type="number" placeholder="60" value={form.depth_cm} onChange={e => set('depth_cm', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Стиль и материалы</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Стиль</Label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map(style => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => set('style', style)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      form.style === style
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'border-gray-300 hover:border-orange-400'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Материал</Label>
                <Input placeholder="МДФ, дерево, ЛДСП..." value={form.material} onChange={e => set('material', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Цвет</Label>
                <Input placeholder="Белый, венге, дуб..." value={form.color} onChange={e => set('color', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Бюджет и сроки</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Бюджет от (сум)</Label>
                <Input type="number" placeholder="2 000 000" value={form.budget_min} onChange={e => set('budget_min', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Бюджет до (сум)</Label>
                <Input type="number" placeholder="5 000 000" value={form.budget_max} onChange={e => set('budget_max', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Желаемый срок готовности</Label>
              <Input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Фотографии</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="images" className="cursor-pointer block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
              <p className="text-gray-500">Нажмите чтобы загрузить фото</p>
              <p className="text-xs text-gray-400 mt-1">До 5 фотографий (JPG, PNG)</p>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </Label>
            {previews.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {previews.map((src, i) => (
                  <img key={i} src={src} alt="" className="w-20 h-20 object-cover rounded-lg border" />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" size="lg" className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading}>
          {loading ? 'Публикуем...' : 'Опубликовать заказ'}
        </Button>
      </form>
    </div>
  )
}
