import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminNav from './admin-nav'

const ADMIN_EMAIL = 'toirovtimurmalik@gmail.com'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 h-screen z-10">
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/" className="text-xs font-bold tracking-widest text-gray-400 hover:text-gray-600">
            ← MEBELHUB
          </Link>
          <div className="mt-3 text-xs font-semibold text-gray-800 tracking-wide uppercase">Админ панель</div>
        </div>
        <AdminNav />
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}
