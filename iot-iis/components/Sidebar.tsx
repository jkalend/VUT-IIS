"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Sidebar() {
    const { data: session } = useSession()
    const textStyle = {
        transition: 'color 0.3s ease, font-size 0.3s ease, line-height 0.3s ease', // Adjust the transition duration as needed
    }

    return (
        <div className={"h-full w-64 fixed top-0 overflow-hidden flex min-h-0 flex-col"}>
            <div className={`flex h-full min-h-0 flex-col`}>
                <div id="sidebar" className={"scrollbar-trigger relative h-full w-full flex-1 items-start border-white/20"} >
                    <nav className={`flex h-full w-full flex-col p-4 bg-gradient-to-r from-gray-800 from-10% transition-transform`}
                    >
                        <ul className="mt-16 fixed">
                            <li className="mb-4 "><Link href="/" className="text-lg hover:text-amber-500 hover:text-2xl" style={textStyle}>Overview</Link></li>
                            {session && <li className="mb-4"><Link href={`/profile/${session?.user?.username}/systems`} className="text-lg hover:text-amber-500 hover:text-2xl" style={textStyle}>My Systems</Link></li>}
                            {session && <li className="mb-4"><Link href={`/profile/${session.user?.username}/devices`} className="text-lg hover:text-amber-500 hover:text-2xl" style={textStyle}>My Devices</Link></li>}
                            <li className="mb-4"><Link href="/" className="text-lg hover:text-amber-500 hover:text-2xl" style={textStyle}>Settings</Link></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
}
