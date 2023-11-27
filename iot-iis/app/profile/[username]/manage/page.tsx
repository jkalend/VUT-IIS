// @ts-nocheck
/* list of all users in systems - with buttons for delete user, edit user, manage devices, manage systems */
"use client";
import {useRouter, useParams, redirect} from "next/navigation";
import { useSession } from "next-auth/react";
import {useEffect, useState} from "react";
import {Session} from "next-auth";
import Link from "next/link";

const ManagePage = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession()
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(false);

    const fetchUsers = async () => {
        if (session && ((session.user?.username == params.username) && (session.is_admin == 1))) {
            const res = await fetch(`/api/profile/${params.username}/admin`, {
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
        if (status === "authenticated") {
            fetchUsers().then(r => {
                setUsers(r);
            });
        } else if (status === "unauthenticated") {
            router.push("/profile/login");
        }
    }, [status])


    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>

    if (session && ((session.user?.username == params.username) && (session.is_admin == 1))) {
        return (
            <div className={"flex flex-col w-full p-2 overflow-y-scroll mb-16"}>
                <div className={"flex flex-row p-5 justify-between"}>
                    <h1 className={"font-bold text-2xl"}>
                        Users
                    </h1>
                </div>
                <div className={"flex flex-col rounded-2xl bg-gray-900 p-2 gap-2"}>
                    {error ? <div className={"text-red-500"}>Error loading users</div> :
                        users.map((user: any) => (
                            <div key={user.username}
                                  className={"flex flex-row justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
                                <Link className={"flex flex-col"} href={`/profile/${user.username}/`}>
                                    <div className={"font-bold text-xl"}>
                                        {user.username}
                                    </div>
                                </Link>
                                <div className={"flex flex-row gap-2"}>
                                    <Link className={"font-bold text-xl rounded-xl bg-black p-1"} href={`/profile/${user.username}/devices`}>
                                        Devices
                                    </Link>
                                    <Link className={"font-bold text-xl rounded-xl bg-black p-1"} href={`/profile/${user.username}/systems`}>
                                        Systems
                                    </Link>
                                    <Link className={"font-bold text-xl rounded-xl bg-black p-1"} href={`/profile/${user.username}/edit`}>
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        ), [])}
                </div>
            </div>
        );
    } else {
        return redirect("/profile/login")
    }
}

export default ManagePage;
