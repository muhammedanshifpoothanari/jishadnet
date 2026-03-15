import { ReactNode } from 'react'

export default function CompanyRegistrationLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {children}
      </div>
    </div>
  )
}
