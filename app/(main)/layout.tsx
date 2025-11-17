// app/(main)/layout.tsx
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="pt-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto space-y-24">
        {children}
      </main>
      <Footer />
    </>
  )
}
