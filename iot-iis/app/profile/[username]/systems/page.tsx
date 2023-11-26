"use client"
import React, {ChangeEvent, useEffect, useState} from 'react'
import {signIn, useSession} from 'next-auth/react'
import {redirect, useParams} from 'next/navigation'
import Link from "next/link";

const SystemPage = () => {
    const { data: session, status } = useSession()
    const [systems, setSystems] = useState([]);
    const params = useParams();
    const [error, setError] = useState(false);

    const fetchData = async () => {
        if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
            const res = await fetch(`/api/profile/${params.username}/systems`, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });
            if (!res.ok) {
                setError(true);
                return [];
            }
            const data = await res.json();
            return data;
        }
    }

    useEffect(() => {
        fetchData().then(r => {
            setSystems(r);
        });
    }, [status])

    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>

    if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
        return (
            <div className={"flex flex-col w-full p-2"}>
                <div className={"flex flex-row p-5 justify-between"}>
                    <h1 className={"font-bold text-2xl"}>
                        Systems
                    </h1>
                    <Link href={`/profile/${params.username}/systems/addSystem`}
                          className={"p-2 rounded-2xl bg-green-950"}>
                        Add system
                    </Link>
                </div>
                <div className={"flex flex-col rounded-2xl bg-gray-900 p-2 gap-2"}>
                    {error ? <div className={"text-red-500"}>Error loading systems</div> :
                    systems?.map((system: any) => (
                        <Link key={system.systemId} href={`/profile/${params.username}/systems/${system.systemId}`}
                              className={"flex flex-row justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
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
                                    {system._count.devices}
                                </h1>
                            </div>
                        </Link>
                    ), [])}
                </div>
            </div>
        );
    } else {
        return redirect("/profile/login")
    }
}

export default SystemPage