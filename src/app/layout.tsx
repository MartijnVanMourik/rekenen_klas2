import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rekenmaatje - Leer Rekenen op een Leuke Manier',
  description: 'Een interactieve rekenapp voor basisschool leerlingen. Oefen met optellen, aftrekken, vermenigvuldigen, delen en meer!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="bg-gray-100 min-h-screen" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}