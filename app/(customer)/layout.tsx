import PublicNav from '@/components/public-nav'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PublicNav />
      <main>{children}</main>
    </div>
  )
}
