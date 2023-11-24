"use client";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import React, {useEffect, useState} from "react";
import Link from "next/link";

function ProtectedPage() {
    const router = useRouter();
    const {data: session} = useSession()
    const [users, setUsers] = useState([]);

    if (session) {
        router.push("/profile/" + session.user?.username);
    }

    const textStyle = {
        transition: 'color 0.3s ease, font-size 0.3s ease, line-height 0.3s ease, font-weight 0.3 ease', // Adjust the transition duration as needed
    }

    const fetchData = async () => {
        const res = await fetch(`/api/profile`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
        const data = await res.json();
        return data;
    }

    useEffect(() => {
        fetchData().then(r => {
            setUsers(r);
        });
    }, [])


    return (
        <div className={"flex relative w-full flex-col"}>
            <h1 className={"pt-12 flex flex-col w-full items-center text-6xl font-extrabold text-amber-700"}>IOTA</h1>
            <div className={"flex flex-row items-center justify-center gap-2"}>
                <h2 className={"py-3 text-xl text-slate-400"}>Internet of Things</h2>
                <h2 className={"py-3 text-xl text-slate-400"}>Application</h2>
            </div>
            <div className={"flex flex-row items-center justify-center gap-2"}>
                <h2 className={" text-xl text-slate-400"}>for</h2>
                <h2 className={" text-2xl text-orange-400"}>Smart</h2>
                <h2 className={" text-2xl text-orange-400"}>Systems</h2>
            </div>
            <div className={"flex flex-row flex-grow-0 items-center text-center justify-center gap-4 pt-16 w-full"}>
                <button onClick={() => router.push("/profile/login")}
                        className={"p-2 text-xl text-slate-200 hover:font-extrabold hover:text-orange-400"}
                        style={textStyle}>
                    Login
                </button>
                <h1 className={"text-xl text-slate-400"}>or</h1>
                <button onClick={() => router.push("/profile/register")}
                        className={"p-2 text-xl text-slate-200 hover:font-extrabold hover:text-orange-400"}
                        style={textStyle}>
                    Register
                </button>
            </div>
            <h1 className={"pt-12 flex flex-col w-full items-center text-4xl font-extrabold text-amber-700"}>Some of our Users</h1>
            <div className={"grid gap-3 rounded-2xl bg-gray-900 p-3 grid-cols-5 grid-rows-4 mt-8"}>
                {users.map((user: any) => (
                    <Link key={user.username} href={`/profile/${user.username}`} className={"flex flex-row justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
                        <div className={"flex flex-col truncate p-2"}>
                            <div className={"font-bold text-xl truncate"}>
                                {user.username}
                            </div>
                        </div>
                    </Link>
                ), [])}
            </div>
        </div>
    );
}

export default ProtectedPage;
