'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { G, BG, BORDER, TEXT, DIM } from '@/lib/tokens'

function currentId(pathname: string) {
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/masters') || pathname.startsWith('/craftsman')) return 'masters'
  if (pathname.startsWith('/works')) return 'works'
  if (pathname.startsWith('/orders') || pathname.startsWith('/dashboard')) return 'cabinet'
  if (pathname.startsWith('/settings') || pathname.startsWith('/profile')) return 'settings'
  return ''
}

interface NavUser {
  id: string
  email?: string
  role?: string
  full_name?: string
  company_name?: string
}

export default function PublicNav() {
  const pathname = usePathname()
  const router = useRouter()
  const cur = currentId(pathname)
  const [navUser, setNavUser] = useState<NavUser | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) { setLoaded(true); return }
      const { data: profile } = await supabase.from('profiles').select('role, full_name, company_name').eq('id', user.id).single()
      setNavUser({ id: user.id, email: user.email, role: profile?.role, full_name: profile?.full_name, company_name: profile?.company_name })
      setLoaded(true)
    }

    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) { setNavUser(null); return }
      supabase.from('profiles').select('role, full_name, company_name').eq('id', session.user.id).single()
        .then(({ data: profile }) => {
          setNavUser({ id: session.user.id, email: session.user.email, role: profile?.role, full_name: profile?.full_name, company_name: profile?.company_name })
        })
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setNavUser(null)
    router.push('/')
  }

  const isCraftsman = navUser?.role === 'craftsman'
  const cabinetHref = isCraftsman ? '/dashboard' : '/orders'
  const orderHref = navUser ? '/orders/new' : '/register?role=customer'

  const navLinks = navUser
    ? isCraftsman
      ? [
          { id: 'home',     label: 'Главная',       href: '/' },
          { id: 'cabinet',  label: 'Лента заказов', href: '/dashboard' },
          { id: 'settings', label: 'Мой профиль',   href: '/profile' },
        ]
      : [
          { id: 'home',    label: 'Главная',  href: '/' },
          { id: 'masters', label: 'Мастера',  href: '/masters' },
          { id: 'works',   label: 'Работы',   href: '/works' },
          { id: 'cabinet', label: 'Кабинет',  href: '/orders' },
          { id: 'settings',label: 'Настройки',href: '/settings' },
        ]
    : [
        { id: 'home',    label: 'Главная',  href: '/' },
        { id: 'masters', label: 'Мастера',  href: '/masters' },
        { id: 'works',   label: 'Работы',   href: '/works' },
      ]

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 40px', borderBottom: `1px solid ${BORDER}`,
      background: BG, position: 'sticky', top: 0, zIndex: 20,
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: TEXT }}>
        <span style={{ color: G, fontSize: 14 }}>◆</span>
        <span style={{ fontSize: 13, letterSpacing: '0.18em', fontWeight: 500 }}>MEBELHUB</span>
      </Link>

      <nav style={{ display: 'flex', gap: 28 }}>
        {navLinks.map(item => (
          <Link key={item.id} href={item.href} style={{
            fontSize: 13, cursor: 'pointer',
            color: cur === item.id ? TEXT : DIM,
            textDecoration: 'none',
            borderBottom: cur === item.id ? `1px solid ${G}` : '1px solid transparent',
            paddingBottom: 2,
          }}>{item.label}</Link>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {!loaded ? (
          <span style={{ fontSize: 13, color: DIM, opacity: 0.4 }}>···</span>
        ) : navUser ? (
          <>
            {isCraftsman && navUser.company_name && (
              <span style={{ fontSize: 12, color: DIM }}>{navUser.company_name}</span>
            )}
            <button
              onClick={handleSignOut}
              style={{ fontSize: 13, color: DIM, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
            >Выйти</button>
            {!isCraftsman && (
              <Link href="/orders/new" style={{
                background: G, color: BG, padding: '10px 18px',
                fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
                textDecoration: 'none', borderRadius: 2,
              }}>Разместить заказ</Link>
            )}
          </>
        ) : (
          <>
            <Link href="/login" style={{ fontSize: 13, color: DIM, textDecoration: 'none' }}>Войти</Link>
            <Link href="/register?role=customer" style={{
              background: G, color: BG, padding: '10px 18px',
              fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
              textDecoration: 'none', borderRadius: 2,
            }}>Разместить заказ</Link>
          </>
        )}
      </div>
    </header>
  )
}
