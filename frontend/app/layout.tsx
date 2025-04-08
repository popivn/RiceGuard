import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lemon AI',
  description: 'Created by PoPi for famer, who want to make their life easier',
  generator: 'Made by PoPi',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="mdl-js">
      <body>{children}</body>
    </html>
  )
}
