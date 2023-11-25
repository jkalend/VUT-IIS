import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Sidebar from "@/components/Sidebar";
import { Provider } from "@/components/Provider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Meow',
  description: 'This will be painful',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={"bg-gray-950 h-full w-full overflow-hidden absolute"}>
      <Provider>
      <Navbar/>
      <Sidebar/>
      <main className={"flex h-full relative ml-64 mt-16 overflow-auto"}>
          {children}
      </main>
      </Provider>
      </body>
    </html>
  )
}
