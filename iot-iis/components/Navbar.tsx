"use client";
import Link from "next/link";
import Image from 'next/image'
import { useState } from "react";
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession()
    const [openDropdown, setOpenDropdown] = useState(false);

    return (
        <nav className={"fixed top-0 w-full mb-16 bg-gradient-to-bl from-gray-800 backdrop-blur-xl text-white z-10 inline-flex justify-between"}>
            <div className={'ml-16 flex flex-row justify-between space-x-5 outline-black'}>
                <Link href={'/'} className={'text-center w-full flex'}>
                    <Image className={"fill-current"} src={"/vercel.svg"} alt={"Menu icon"} width={50} height={50}/>
                </Link>
            </div>
            <div className={'flex justify-between gap-3'}>
                {!session && <>
                <Link
                    href={'/profile/login'}
                    className={'text-center items-center flex bg-black rounded-xl border-amber-50 hover:bg-orange-900 whitespace-nowrap px-3 my-[0.4rem]'}
                >
                    Sign In
                </Link>
                <Link
                    href={'/profile/register'}
                    className={'text-center items-center flex bg-black rounded-xl border-amber-50 hover:bg-orange-900 whitespace-nowrap px-3 my-[0.4rem]'}
                >
                    Sign Up
                </Link>
                </>}
                <div className={"flex end-0 mx-2 px-10 py-2 gap-2 items-center"}>
                    <button id="profile"
                            className="text-center flex items-center gap-3 p-1"
                            onClick={() => setOpenDropdown(!openDropdown)}
                            >
                        <span className={"text-white text-2xl font-semibold font-['Inter']"}>{session ? session.user?.username : "Visitor"}</span>
                    </button>
                </div>
                {session && <>
                <div className={`${openDropdown ? "flex" : "hidden"} flex-col right-12 absolute top-16 bg-gray-800 rounded-xl p-2`}>
                    <Link href={`/profile/${session.user?.username}`}
                          className={'text-center justify-center items-center flex bg-black rounded-xl border-amber-50 hover:bg-orange-900 whitespace-nowrap px-3 my-[0.4rem]'}
                          onClick={() => setOpenDropdown(false)}>
                        My Profile
                    </Link>
                    <Link href={`/profile/${session.user?.username}/edit`}
                          className={'text-center justify-center items-center flex bg-black rounded-xl border-amber-50 hover:bg-orange-900 whitespace-nowrap px-3 my-[0.4rem]'}
                          onClick={() => setOpenDropdown(false)}>
                        Edit Profile
                    </Link>
                    <button
                        className={'text-center justify-center items-center flex bg-black rounded-xl border-amber-50 hover:bg-orange-900 whitespace-nowrap px-3 my-[0.4rem]'}
                        onClick={() => {
                            signOut({callbackUrl: "/"})
                        }}>
                        Logout
                    </button>
                </div>
                </>}
            </div>
        </nav>
    );
}
