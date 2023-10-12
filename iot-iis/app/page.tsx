import Image from 'next/image'
import Menu from '../components/Menu'
import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <p className={"text-2xl font-bold text-center"}>Please delete the item after adding it and not doing anything with it or you or anyone else really will get an error in your lovely terminal</p>
        <Menu></Menu>
    </main>
  )
}
