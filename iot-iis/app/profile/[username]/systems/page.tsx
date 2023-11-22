"use client"
import React, {ChangeEvent, useEffect, useState} from 'react'
import {signIn, useSession} from 'next-auth/react'
import { useParams} from 'next/navigation'
import Link from "next/link";

const SystemPage = () => {
    const { data: session, status } = useSession()
    const [systems, setSystems] = useState([]);
    const params = useParams();

    const fetchData = async () => {
        if (!session) return;
        const res = await fetch(`/api/profile/${session.user?.username}/systems`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        //if (!res.ok) throw new Error("Failed to fetch devices");
        const data = await res.json();
        setSystems(data);
        //console.log(data);
    }

    useEffect(() => {
        fetchData().then(r => {
        });
    }, [status])

    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>

    return (
        <div className={"flex flex-col w-full p-2"}>
            <div className={"flex flex-row p-5 justify-between"}>
                <h1 className={"font-bold text-2xl"}>
                    Systems
                </h1>
                <Link href={`/profile/${session?.user?.username}/systems/addSystem`} className={"p-2 rounded-2xl bg-green-950"}>
                    Add system
                </Link>
            </div>
            <div className={"flex flex-col rounded-2xl bg-gray-900 p-2 gap-2"}>
                {systems.map((system: any) => (
                    <Link key={system.id} href={`/profile/${session?.user?.username}/systems/${system.systemId}`} className={"flex flex-row justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
                        <div className={"flex flex-col"}>
                            <div className={"font-bold text-xl"}>
                                {system.name}
                            </div>
                            <h1 className={"text-gray-500"}>
                                {system.description}
                            </h1>
                        </div>
                        <div className={"flex flex-col"}>
                            <h1 className={"font-bold text-xl"}>
                                {system.devices.length}
                            </h1>
                        </div>
                    </Link>
                ), [])}
            </div>
        </div>
    );
}

export default SystemPage