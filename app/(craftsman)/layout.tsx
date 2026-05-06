import PublicNav from '@/components/public-nav'

export default function CraftsmanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PublicNav />
      <main>{children}</main>
    </div>
  )
}
