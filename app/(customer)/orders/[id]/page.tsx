'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { G, BG, BG2, BORDER, TEXT, DIM, MUTE, SUCCESS, MONO, HEAD } from '@/lib/tokens'
import type { Order, Offer } from '@/types'

type OfferWithCraftsman = Offer & {
  craftsman: { full_name: string; rating: number | null; reviews_count: number; verified: boolean }
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [order, setOrder]           = useState<Order | null>(null)
  const [offers, setOffers]         = useState<OfferWithCraftsman[]>([])
  const [selectedOffer, setSelected] = useState<OfferWithCraftsman | null>(null)
  const [messages, setMessages]     = useState<{ from: 'me' | 'other'; text: string; time: string }[]>([])
  const [input, setInput]           = useState('')
  const [loading, setLoading]       = useState(true)
  const [accepting, setAccepting]   = useState(false)
  const [completing, setCompleting] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewHover, setReviewHover]   = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSent, setReviewSent]     = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [hasReview, setHasReview]       = useState(false)
  const [userRole, setUserRole] = useState<'customer' | 'craftsman' | null>(null)
  const [myOffer, setMyOffer] = useState<Offer | null>(null)
  const [offerPrice, setOfferPrice] = useState('')
  const [offerDays, setOfferDays] = useState('')
  const [offerComment, setOfferComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const uid = session?.user?.id ?? null

      const [orderRes, offersRes, profileRes] = await Promise.all([
        supabase.from('orders').select('*').eq('id', id).single(),
        supabase.from('offers')
          .select('*, craftsman:profiles!craftsman_id(full_name, rating, reviews_count, verified)')
          .eq('order_id', id)
          .order('created_at'),
        uid ? supabase.from('profiles').select('role').eq('id', uid).single() : Promise.resolve({ data: null }),
      ])

      setOrder(orderRes.data)
      const offs = (offersRes.data ?? []) as OfferWithCraftsman[]
      setOffers(offs)
      const accepted = offs.find(o => o.status === 'accepted')
      setSelected(accepted ?? offs[0] ?? null)

      const role = (profileRes as any).data?.role === 'craftsman' ? 'craftsman' : 'customer'
      setUserRole(role)

      if (role === 'craftsman' && uid) {
        const { data: existing } = await supabase.from('offers')
          .select('*').eq('order_id', id).eq('craftsman_id', uid).maybeSingle()
        setMyOffer(existing)
      }

      if (role === 'customer' && session?.user && orderRes.data?.status === 'completed') {
        const { data: review } = await supabase
          .from('reviews')
          .select('id')
          .eq('order_id', id)
          .eq('customer_id', session.user.id)
          .maybeSingle()
        setHasReview(!!review)
      }

      setLoading(false)
    }
    load()
  }, [id])

  async function submitOffer() {
    if (!offerPrice || !offerDays) return
    setSubmitting(true)
    const res = await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: id,
        price: Number(offerPrice),
        delivery_days: Number(offerDays),
        comment: offerComment || null,
      }),
    })
    const data = await res.json()
    if (res.ok) setMyOffer(data.offer)
    setSubmitting(false)
  }

  const send = () => {
    if (!input.trim()) return
    const now = new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { from: 'me', text: input, time: now }])
    setInput('')
  }

  async function acceptOffer(offerId: string) {
    setAccepting(true)
    const res = await fetch('/api/offers/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId, orderId: id }),
    })
    if (res.ok) {
      router.refresh()
      const updatedOffers = offers.map(o => ({
        ...o,
        status: o.id === offerId ? 'accepted' : 'rejected',
      } as OfferWithCraftsman))
      setOffers(updatedOffers)
      setOrder(prev => prev ? { ...prev, status: 'in_progress' } : prev)
      const accepted = updatedOffers.find(o => o.id === offerId)
      if (accepted) setSelected(accepted)
    }
    setAccepting(false)
  }

  async function completeOrder() {
    setCompleting(true)
    const res = await fetch('/api/orders/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: id }),
    })
    if (res.ok) setOrder(prev => prev ? { ...prev, status: 'completed' } : prev)
    setCompleting(false)
  }

  async function submitReview() {
    if (!reviewRating || !selectedOffer) return
    setReviewLoading(true)
    const res = await fetch('/api/reviews/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: id,
        craftsmanId: selectedOffer.craftsman_id,
        rating: reviewRating,
        comment: reviewComment || null,
      }),
    })
    if (res.ok) {
      setReviewSent(true)
      setHasReview(true)
    }
    setReviewLoading(false)
  }

  if (loading) {
    return (
      <div style={{ background: BG, color: MUTE, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 60px)', fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em' }}>
        ЗАГРУЗКА…
      </div>
    )
  }

  if (!order) {
    return (
      <div style={{ background: BG, color: MUTE, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 60px)', gap: 16 }}>
        <div style={{ fontFamily: HEAD, fontSize: 32 }}>Заказ не найден</div>
        <Link href="/orders" style={{ color: G, fontSize: 13 }}>← Все заказы</Link>
      </div>
    )
  }

  /* ── CRAFTSMAN VIEW ─────────────────────────────────────────── */
  if (userRole === 'craftsman') {
    const canSubmit = !myOffer && order.status === 'open'
    const statusLabel: Record<string, string> = { open: 'Сбор офферов', in_progress: 'В работе', completed: 'Завершён', cancelled: 'Отменён' }

    return (
      <div className="px-page" style={{ background: BG, color: TEXT, minHeight: 'calc(100vh - 60px)', paddingTop: 40, paddingBottom: 40 }}>
        <div className="grid-sidebar" style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Left: order details */}
          <div>
            <Link href="/dashboard" style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.1em', textDecoration: 'none' }}>← ЛЕНТА ЗАКАЗОВ</Link>
            <h1 style={{ fontFamily: HEAD, fontSize: 48, fontWeight: 300, letterSpacing: '-0.02em', margin: '16px 0 8px', lineHeight: 1.1 }}>{order.title}</h1>
            <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.1em', marginBottom: 32 }}>
              {statusLabel[order.status] ?? order.status} · {offers.length} офферов
            </div>

            {order.description && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', marginBottom: 12 }}>ОПИСАНИЕ</div>
                <p style={{ fontSize: 15, color: DIM, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{order.description}</p>
              </div>
            )}

            {order.images?.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', marginBottom: 12 }}>РЕФЕРЕНСЫ ЗАКАЗЧИКА</div>
                <div className="grid-3" style={{ gap: 2, background: BORDER }}>
                  {order.images.map((url, i) => {
                    const isImage = /\.(jpe?g|png|gif|webp|avif|svg)(\?|$)/i.test(url)
                    return isImage ? (
                      <a key={i} href={url} target="_blank" rel="noreferrer">
                        <img src={url} alt={`Референс ${i + 1}`} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
                      </a>
                    ) : (
                      <a key={i} href={url} target="_blank" rel="noreferrer"
                        style={{ background: BG2, aspectRatio: '4/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', color: G, padding: 16 }}>
                        <span style={{ fontSize: 28 }}>📎</span>
                        <span style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.08em', textAlign: 'center', wordBreak: 'break-all' }}>
                          {url.split('/').pop()?.slice(0, 30)}
                        </span>
                      </a>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="grid-2-sm" style={{ gap: 2, background: BORDER, marginBottom: 32 }}>
              {[
                ['ТИП МЕБЕЛИ', order.furniture_type],
                ['МАТЕРИАЛ', order.material],
                ['СТИЛЬ', (order as any).style],
                ['БЮДЖЕТ', order.budget_max ? `$${Number(order.budget_min).toLocaleString()} — $${Number(order.budget_max).toLocaleString()}` : null],
                ['СРОК ДО', order.deadline ? new Date(order.deadline).toLocaleDateString('ru', { day: 'numeric', month: 'long' }) : null],
                ['РАЗМЕРЫ', (order as any).width_cm || (order as any).height_cm ? `${(order as any).width_cm ?? '?'}×${(order as any).height_cm ?? '?'}×${(order as any).depth_cm ?? '?'} см` : null],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label as string} style={{ background: BG, padding: '18px 20px' }}>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 14, color: TEXT }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: offer form or current offer + chat */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {myOffer ? (
              <>
                {/* Offer status card */}
                <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: 24 }}>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: G, letterSpacing: '0.14em', marginBottom: 16 }}>МОЙ ОФФЕР</div>
                  <div style={{ fontFamily: HEAD, fontSize: 32, color: G, marginBottom: 2 }}>${Number(myOffer.price).toLocaleString()}</div>
                  <div style={{ fontSize: 13, color: MUTE, marginBottom: 16 }}>{myOffer.delivery_days} дней</div>
                  {myOffer.comment && (
                    <p style={{ fontSize: 13, color: DIM, lineHeight: 1.6, margin: '0 0 16px', padding: '12px 14px', background: BG, border: `1px solid ${BORDER}` }}>{myOffer.comment}</p>
                  )}
                  <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', padding: '10px 14px', border: `1px solid ${BORDER}`, textAlign: 'center', color: myOffer.status === 'accepted' ? G : myOffer.status === 'rejected' ? '#f87171' : MUTE }}>
                    {{ pending: '○ Ожидает ответа заказчика', accepted: '✓ Оффер принят!', rejected: '✕ Не принят' }[myOffer.status as string] ?? myOffer.status}
                  </div>
                </div>

                {/* Chat */}
                <div style={{ border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', height: 420 }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}`, fontFamily: MONO, fontSize: 10, color: G, letterSpacing: '0.14em', flexShrink: 0 }}>
                    ЧАТ С ЗАКАЗЧИКОМ
                  </div>
                  <div style={{ flex: 1, padding: '16px 18px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {messages.length === 0 ? (
                      <div style={{ fontSize: 12, color: MUTE, textAlign: 'center', marginTop: 20 }}>Напишите заказчику — задайте вопросы по проекту</div>
                    ) : (
                      messages.map((msg, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
                          <div style={{ maxWidth: '80%', background: msg.from === 'me' ? 'rgba(228,182,104,0.08)' : BG2, border: `1px solid ${msg.from === 'me' ? G : BORDER}`, padding: '10px 14px', borderRadius: 2 }}>
                            <div style={{ fontSize: 13, lineHeight: 1.5 }}>{msg.text}</div>
                            <div style={{ fontSize: 10, color: MUTE, marginTop: 6, fontFamily: MONO }}>{msg.time}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div style={{ padding: '12px 14px', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 8, flexShrink: 0 }}>
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && send()}
                      placeholder="Сообщение…"
                      style={{ flex: 1, background: BG2, border: `1px solid ${BORDER}`, color: TEXT, padding: '10px 14px', fontSize: 13, outline: 'none', fontFamily: 'inherit', borderRadius: 2 }}
                    />
                    <button onClick={send} style={{ background: G, color: BG, border: 'none', padding: '0 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}>→</button>
                  </div>
                </div>
              </>
            ) : canSubmit ? (
              <>
                <div style={{ fontFamily: MONO, fontSize: 10, color: G, letterSpacing: '0.14em', marginBottom: 20 }}>ПОДАТЬ ОФФЕР</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>ЦЕНА · USD</label>
                    <input
                      type="number" min="1" value={offerPrice} onChange={e => setOfferPrice(e.target.value)}
                      placeholder="например 1500"
                      style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, color: TEXT, padding: '14px 16px', fontSize: 16, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>СРОК ВЫПОЛНЕНИЯ · ДНИ</label>
                    <input
                      type="number" min="1" value={offerDays} onChange={e => setOfferDays(e.target.value)}
                      placeholder="например 21"
                      style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, color: TEXT, padding: '14px 16px', fontSize: 16, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>КОММЕНТАРИЙ</label>
                    <textarea
                      value={offerComment} onChange={e => setOfferComment(e.target.value)} rows={4}
                      placeholder="Опыт с похожими проектами, что включено в стоимость, условия оплаты…"
                      style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, color: TEXT, padding: '14px 16px', fontSize: 14, outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.5, boxSizing: 'border-box' }}
                    />
                  </div>
                  <button
                    onClick={submitOffer}
                    disabled={!offerPrice || !offerDays || submitting}
                    style={{ background: offerPrice && offerDays && !submitting ? G : BG2, color: offerPrice && offerDays && !submitting ? BG : MUTE, border: 'none', padding: '16px', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', cursor: offerPrice && offerDays && !submitting ? 'pointer' : 'default', borderRadius: 2, fontFamily: 'inherit' }}
                  >
                    {submitting ? 'Отправляем…' : 'Отправить оффер →'}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: 28 }}>
                <div style={{ fontSize: 14, color: MUTE, textAlign: 'center', padding: '20px 0' }}>
                  Заказ уже не принимает офферы
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    )
  }
  /* ── END CRAFTSMAN VIEW ─────────────────────────────────────── */

  return (
    <div className="grid-chat" style={{ background: BG, color: TEXT }}>

      {/* Left: offers list */}
      <aside style={{ borderRight: `1px solid ${BORDER}`, overflowY: 'auto' }}>
        <div style={{ padding: '24px 20px 16px', borderBottom: `1px solid ${BORDER}` }}>
          <Link href="/orders" style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.1em', textDecoration: 'none' }}>← ЗАКАЗЫ</Link>
          <div style={{ fontFamily: HEAD, fontSize: 18, marginTop: 10, lineHeight: 1.2 }}>{order.title}</div>
        </div>

        <div style={{ padding: '12px 0' }}>
          <div style={{ padding: '0 20px 10px', fontFamily: MONO, fontSize: 10, color: G, letterSpacing: '0.14em' }}>
            ОФФЕРЫ · {offers.length}
          </div>
          {offers.length === 0 ? (
            <div style={{ padding: '20px', fontSize: 13, color: MUTE }}>Офферов пока нет. Мастера скоро откликнутся.</div>
          ) : (
            offers.map(offer => (
              <button
                key={offer.id}
                onClick={() => setSelected(offer)}
                style={{
                  width: '100%', padding: '14px 20px', textAlign: 'left', cursor: 'pointer',
                  borderLeft: selectedOffer?.id === offer.id ? `2px solid ${G}` : '2px solid transparent',
                  background: selectedOffer?.id === offer.id ? BG2 : 'transparent',
                  border: 'none', color: TEXT, fontFamily: 'inherit',
                }}>
                <div style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {offer.craftsman.full_name}
                  {offer.craftsman.verified && (
                    <span style={{ fontSize: 10, color: G, fontFamily: MONO, letterSpacing: '0.08em' }}>✓ ПРОВЕРЕН</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: offer.status === 'accepted' ? G : MUTE, marginTop: 2 }}>
                  ${offer.price.toLocaleString()} · {offer.delivery_days} дн.
                  {offer.status === 'accepted' && ' · Принят'}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Center: chat */}
      <main style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {selectedOffer ? (
          <>
            <div style={{ padding: '16px 28px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div>
                <div style={{ fontFamily: HEAD, fontSize: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                  {selectedOffer.craftsman.full_name}
                  {selectedOffer.craftsman.verified && (
                    <span style={{ fontSize: 11, color: G, fontFamily: MONO, letterSpacing: '0.08em' }}>✓ ПРОВЕРЕН</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: SUCCESS, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: SUCCESS, display: 'inline-block' }} />
                  Онлайн
                </div>
              </div>
            </div>

            <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
              <div style={{ textAlign: 'center', fontSize: 11, color: MUTE, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Начало переписки</div>
              <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: '14px 18px', borderRadius: 2, maxWidth: '70%' }}>
                <div style={{ fontSize: 14, lineHeight: 1.5 }}>{selectedOffer.comment || 'Готов взяться за ваш заказ.'}</div>
                <div style={{ fontSize: 10, color: MUTE, marginTop: 8, fontFamily: MONO }}>
                  {new Date(selectedOffer.created_at).toLocaleString('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '66%', background: msg.from === 'me' ? 'rgba(228,182,104,0.08)' : BG2, border: `1px solid ${msg.from === 'me' ? G : BORDER}`, padding: '14px 18px', borderRadius: 2 }}>
                    <div style={{ fontSize: 14, lineHeight: 1.5 }}>{msg.text}</div>
                    <div style={{ fontSize: 10, color: MUTE, marginTop: 8, fontFamily: MONO }}>{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '14px 28px', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 10, flexShrink: 0 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Напишите сообщение…"
                style={{ flex: 1, background: BG2, border: `1px solid ${BORDER}`, color: TEXT, padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: 'inherit', borderRadius: 2 }}
              />
              <button onClick={send} style={{ background: G, color: BG, border: 'none', padding: '0 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}>
                →
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTE, fontSize: 13 }}>
            Выберите оффер для чата
          </div>
        )}
      </main>

      {/* Right: order + offer details */}
      <aside style={{ borderLeft: `1px solid ${BORDER}`, padding: 24, overflowY: 'auto' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: G, letterSpacing: '0.14em', marginBottom: 12 }}>ДЕТАЛИ ЗАКАЗА</div>
        <div style={{ fontFamily: HEAD, fontSize: 20, marginBottom: 20, lineHeight: 1.2 }}>{order.title}</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 14px', fontSize: 13, marginBottom: 24 }}>
          <span style={{ color: MUTE, fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em' }}>СТАТУС</span>
          <span style={{ color: G }}>
            {{ open: 'Сбор офферов', in_progress: 'В работе', completed: 'Завершён', cancelled: 'Отменён' }[order.status]}
          </span>
          {order.furniture_type && <>
            <span style={{ color: MUTE, fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em' }}>ТИП</span>
            <span>{order.furniture_type}</span>
          </>}
          {order.material && <>
            <span style={{ color: MUTE, fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em' }}>МАТЕРИАЛ</span>
            <span>{order.material}</span>
          </>}
          {(order.budget_min || order.budget_max) && <>
            <span style={{ color: MUTE, fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em' }}>БЮДЖЕТ</span>
            <span>${order.budget_min?.toLocaleString()}—${order.budget_max?.toLocaleString()}</span>
          </>}
          {order.deadline && <>
            <span style={{ color: MUTE, fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em' }}>СРОК ДО</span>
            <span>{new Date(order.deadline).toLocaleDateString('ru', { day: 'numeric', month: 'short' })}</span>
          </>}
        </div>

        {selectedOffer && order.status === 'open' && selectedOffer.status === 'pending' && (
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: G, letterSpacing: '0.14em', marginBottom: 12 }}>ОФФЕР</div>
            <div style={{ fontFamily: HEAD, fontSize: 26, color: G, marginBottom: 4 }}>
              ${selectedOffer.price.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: MUTE, fontFamily: MONO, marginBottom: 20 }}>{selectedOffer.delivery_days} дней</div>
            <button
              onClick={() => acceptOffer(selectedOffer.id)}
              disabled={accepting}
              style={{ width: '100%', background: accepting ? BG2 : G, color: accepting ? MUTE : BG, border: 'none', padding: '13px', fontSize: 13, fontWeight: 600, cursor: accepting ? 'default' : 'pointer', borderRadius: 2, marginBottom: 8 }}>
              {accepting ? 'Принятие…' : 'Принять оффер →'}
            </button>
          </div>
        )}

        {selectedOffer?.status === 'accepted' && (
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: G, letterSpacing: '0.14em', marginBottom: 8 }}>ПРИНЯТЫЙ ОФФЕР</div>
            <div style={{ fontFamily: HEAD, fontSize: 26, color: G }}>${selectedOffer.price.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: MUTE, fontFamily: MONO, marginBottom: 20 }}>{selectedOffer.delivery_days} дней</div>

            {order.status === 'in_progress' && (
              <button onClick={completeOrder} disabled={completing}
                style={{ width: '100%', background: completing ? BG2 : 'rgba(74,222,128,0.12)', color: completing ? MUTE : SUCCESS, border: `1px solid ${SUCCESS}`, padding: '13px', fontSize: 13, fontWeight: 600, cursor: completing ? 'default' : 'pointer', borderRadius: 2, fontFamily: 'inherit' }}>
                {completing ? 'Закрываем…' : '✓ Мебель получена — завершить'}
              </button>
            )}

            {order.status === 'completed' && (
              <div style={{ marginTop: 4 }}>
                {hasReview || reviewSent ? (
                  <div style={{ fontSize: 13, color: SUCCESS, padding: '12px 0' }}>✓ Отзыв оставлен. Спасибо!</div>
                ) : (
                  <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: G, letterSpacing: '0.14em', marginBottom: 16 }}>ОСТАВИТЬ ОТЗЫВ</div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                      {[1,2,3,4,5].map(star => (
                        <button key={star} type="button"
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setReviewHover(star)}
                          onMouseLeave={() => setReviewHover(0)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 28, color: (reviewHover || reviewRating) >= star ? G : MUTE, padding: 0, lineHeight: 1 }}>
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      placeholder="Качество работы, соблюдение сроков…"
                      rows={3}
                      style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, color: TEXT, padding: '12px 14px', fontSize: 13, outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.5, boxSizing: 'border-box', marginBottom: 12 }}
                    />
                    <button onClick={submitReview} disabled={!reviewRating || reviewLoading}
                      style={{ width: '100%', background: reviewRating && !reviewLoading ? G : BG2, color: reviewRating && !reviewLoading ? BG : MUTE, border: 'none', padding: '12px', fontSize: 13, fontWeight: 600, cursor: reviewRating && !reviewLoading ? 'pointer' : 'default', borderRadius: 2, fontFamily: 'inherit' }}>
                      {reviewLoading ? 'Отправляем…' : 'Отправить отзыв'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  )
}
