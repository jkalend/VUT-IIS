import Link from "next/link";
import Image from 'next/image'

//https://icon-library.com/images/sandwich-menu-icon/sandwich-menu-icon-24.jpg
export default function Navbar() {
    return (
        <nav className={"fixed top-0 w-full bg-gray-800 text-white"}>
            <div className={"container mx-auto p-2.5"}>
                <ul className={'flex flex-row justify-between'}>
                    <div className={'flex flex-row justify-between space-x-5 outline-black'}>
                        <Link href={'/'} className={'text-center w-full flex'}>
                            <Image className={"fill-current"} src={"/sandwich-menu-icon-24.jpg"} alt={"Menu icon"} width={50} height={50}/>
                        </Link>
                    </div>
                    <div className={'flex flex-row justify-between space-x-5'}>
                        <Link
                            href={'/login'}
                            className={'navbar_button'}
                        >
                            Sign In
                        </Link>
                        <Link
                            href={'/register'}
                            className={'navbar_button'}
                        >
                            Sign Up
                        </Link>
                    </div>
                </ul>
            </div>
        </nav>
    );
}