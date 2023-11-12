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
      <body className={"bg-gray-950 min-h-screen min-w-screen absolute"}>
      <Navbar/>
      <Sidebar/>
      <main className={"flex h-full w-full relative overflow-hidden ml-64 mt-16"}>
         <Provider>
          {children}
         </Provider>
      </main>
      </body>
    </html>
  )
}
