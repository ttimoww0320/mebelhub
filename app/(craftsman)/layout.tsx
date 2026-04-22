import Navbar from '@/components/navbar'

export default function CraftsmanLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}
