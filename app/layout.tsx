import { Space_Mono } from "next/font/google"
import type React from "react"
import "./globals.css"

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
})

export const metadata = {
  title: "Myalo - Your AI Assistant",
  description: "Myalo is an AI assistant powered by advanced language models.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={spaceMono.variable}>
      <body className="font-mono">{children}</body>
    </html>
  )
}

