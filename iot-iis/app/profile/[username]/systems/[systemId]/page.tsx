// @ts-nocheck
"use client";
import {useRouter, useParams} from "next/navigation";
import { useSession } from "next-auth/react";
import React, { FormEvent, useEffect, useState} from "react";
import Link from "next/link";

const SystemPage = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession()
    const [devices, setDevices] = useState([]);
    const [allDevices, setAllDevices] = useState([]);
    const [dropdown, setDropdown] = useState(false);
    const [dropdown2, setDropdown2] = useState(false);
    const [system, setSystem] = useState({} as any);
    const [users, setUsers] = useState([]);
    const [refreshed, setRefreshed] = useState(false);
    const [error, setError] = useState({
        deviceChoice: false,
        addUser: false,
        removeUser: false,
        addDevice: false,
        removeDevice: false,
        devices: false,
        users: false,
        system: false,
    });

    const fetchDevices = async () => {
        if (!session) return;
        // not shared
        const res = await fetch(`/api/profile/${params.username}/devices`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
            setError({...error, deviceChoice: true});
            return [];
        }
        const data = await res.json();

        //filter for null systemId
        return data.filter((device: any) => device.systemId === null)
    }

    const addDevice = async (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!session) return;
        const formData = new FormData(e.currentTarget)
        const res = await fetch(`/api/profile/${params.username}/systems/${params.systemId}/devices`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                deviceId: formData.get("deviceId"),
            }),
        });
        if (!res.ok) {
            setError({...error, addDevice: true});
            return;
        }
        setRefreshed(false)
    }

    const removeDevice = async (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!session) return;
        const formData = new FormData(e.currentTarget)
        const res = await fetch(`/api/profile/${params.username}/systems/${params.systemId}/devices`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                deviceId: formData.get("deviceId"),
            }),
        });
        if (!res.ok) {
            setError({...error, removeDevice: true});
            return;
        }
        setRefreshed(false)
    }

    const getDevices = async () => {
        if (!session) return;
        const res = await fetch(`/api/profile/${params.username}/systems/${params.systemId}/devices`, {
            method: "Get",
            headers: {"Content-Type": "application/json"},
        });
        if (!res.ok) {
            setError({...error, devices: true});
            return [];
        }
        const data = await res.json();
        return data;
    }

    const getSystem = async () => {
        if (!session) return;
        const res = await fetch(`/api/profile/${params.username}/systems/${params.systemId}`, {
            method: "Get",
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
            setError({...error, system: true});
            return [];
        }
        const data = await res.json();
        return data;
    }

    const getUsers = async () => {
        if (!session) return;
        const res = await fetch(`/api/profile/${params.username}/systems/${params.systemId}/share`, {
            method: "Get",
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
            setError({...error, users: true});
            return [];
        }
        const data = await res.json();
        return data;
    }

    const addShare = async (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!session) return;
        const formData = new FormData(e.currentTarget)
        const res = await fetch(`/api/profile/${params.username}/systems/${params.systemId}/share`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username_add: formData.get("username"),
            }),
        });
        if (!res.ok) {
            setError({...error, addUser: true});
            return;
        }
        setRefreshed(false)
    }

    const removeUser = async (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!session) return;
        const formData = new FormData(e.currentTarget)
        const res = await fetch(`/api/profile/${params.username}/systems/${params.systemId}/share`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username_del: formData.get("username"),
            }),
        });
        if (!res.ok) {
            setError({...error, removeUser: true});
            return;
        }
        setRefreshed(false)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (status === "authenticated" && !refreshed) {
                try {
                    getSystem().then(r => {
                        setSystem(r);
                    });
                    getDevices().then(r => {
                        setDevices(r);
                    });

                    //not for shared
                    if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
                        fetchDevices().then(r => {
                            setAllDevices(r);
                        });
                        getUsers().then(r => {
                            setUsers(r.allowed_users);
                            // setUsers([{username: "test"}, {username: "test2"}])
                        });
                    }
                    clearTimeout(timer)
                } catch (e) {
                    router.push("/");
                }
                setRefreshed(true);

                for (const [key, value] of Object.entries(error)) {
                    if (key === ("deviceChoice" || "system" || "users" || "devices")) continue;
                    if (value) {
                        setError({...error, [key]: false});
                    }
                }
            } else if (status === "unauthenticated") {
                router.push("/profile/login");
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [status, devices, users]);

    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>

    if (error.system)
        return (
            <div className={"flex h-screen w-screen justify-center items-center text-center font-bold text-4xl"}>
                Error loading a system
            </div>
        )

    return (
        <div className={"flex flex-col w-full p-2"}>
            <div className={"flex flex-col p-5 justify-between"}>
                <div className={"flex flex-row gap-2 w-full justify-between"}>
                    <div className={"flex flex-row gap-2"}>
                        <h1 className={"font-bold text-2xl"}>
                            System
                        </h1>
                        <h1 className={"font-bold text-2xl text-orange-400"}>
                            {system.name}
                        </h1>
                    </div>
                    {session?.user?.username == params.username && (
                    <Link href={`/profile/${params.username}/systems/${params.systemId}/editSystem`} className={"p-2 rounded-2xl bg-orange-500"}>
                        Edit system
                    </Link>
                    )}
                </div>
                <div className={"flex flex-row gap-2"}>
                    <h1 className={"font-bold text-base text-gray-400"}>
                        {system.description}
                    </h1>
                </div>
            </div>
            <div className={"flex flex-row p-5 justify-between"}>
                <h1 className={"font-bold text-2xl"}>
                    Devices
                </h1>
                {session?.user?.username == params.username && (
                <div className={"flex flex-row gap-2"}>
                    <button onClick={() => setDropdown(!dropdown)} className={"p-2 rounded-2xl bg-green-950"}>
                        {dropdown ? "Close" : "Add device"}
                    </button>
                    {dropdown &&
                        <div>
                            <div className={"flex flex-col gap-2 min-w-[48px]"}>
                                <form onSubmit={addDevice} className={"flex flex-row gap-2"}>
                                <select name={"deviceId"} id={"deviceId"} className={"text-white bg-gray-700 rounded-2xl w-fit min-w-[48px] max-w-[160px]"}>
                                    {error.deviceChoice ? <option value={""}>Error loading devices</option> :
                                        allDevices.map((device: any) => (
                                        <option key={device.deviceId} value={device.deviceId}>{device.alias}</option>
                                    ))}
                                </select>
                                <button type="submit" className={"p-2 rounded-2xl bg-green-950"}>
                                    {error.deviceChoice ? "" : "Add"}
                                </button>
                                </form>
                            </div>
                            <h1 className={"text-red-700"}>
                                {error.addDevice ? "Error adding a device" : ""}
                            </h1>
                        </div>
                    }
                </div>
                )}
            </div>
            <div className={"flex flex-col rounded-2xl bg-gray-900 p-2 gap-2 overflow-auto max-h-[50%]"}>
                {session?.user?.username == params.username ? (
                    error.devices ? <div className={"text-red-500"}>Error loading devices</div> :
                        devices.map((device: any) => (
                            <div key={device.deviceId} className={"flex flex-row items-center justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
                                <Link href={`/profile/${params.username}/devices/${device.deviceId}`} className={"w-[90%] flex flex-row justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
                                    <div className={"flex flex-col"}>
                                        <div className={"font-bold text-xl"}>
                                            {device.alias}
                                        </div>
                                        <h1 className={"text-gray-500"}>
                                            {device.deviceType.name}
                                        </h1>
                                    </div>
                                </Link>
                                <form className={"flex flex-col w-[10%]"} onSubmit={removeDevice}>
                                    <input name={"deviceId"} value={device.deviceId} hidden={true} onChange={() => {}}/>
                                    <button type={"submit"} className={"min-w-fit z-10 p-2 text-center font-bold text-xl rounded-xl bg-red-800"}>
                                        Remove
                                    </button>
                                </form>
                                {error.removeDevice && <h1 className={"text-red-700"}>Error removing a device</h1>}
                            </div>
                    ), [])
                ) : (
                    error.devices ? <div className={"text-red-500"}>Error loading devices</div> :
                        devices.map((device: any) => (
                            <Link key={device.deviceId} href={`/profile/${params.username}/devices/${device.deviceId}`} className={"flex flex-row justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
                                <div className={"flex flex-col"}>
                                    <div className={"font-bold text-xl"}>
                                        {device.alias}
                                    </div>
                                    <h1 className={"text-gray-500"}>
                                        {device.deviceType.name}
                                    </h1>
                                </div>
                            </Link>
                    ), [])
                )}
            </div>
            {session?.user?.username == params.username && (
                <>
            <div className={"flex flex-row p-5 justify-between mt-32"}>
                <h1 className={"font-bold text-2xl"}>
                    Users
                </h1>
                <div className={"flex flex-row gap-2"}>
                    <button onClick={() => setDropdown2(!dropdown2)} className={"p-2 rounded-2xl bg-green-950"}>
                        {dropdown2 ? "Close" : "Add user"}
                    </button>
                    {dropdown2 &&
                        <div>
                            <div className={"flex flex-col gap-2"}>
                                <form onSubmit={addShare} className={"flex flex-row gap-2"}>
                                    <input name={"username"} id={"usernameADD"} type={"text"} placeholder={"Username"}
                                           className={"text-white bg-gray-700 rounded-2xl p-2"}/>
                                    <button type="submit" className={"p-2 rounded-2xl bg-green-950"}>
                                        Add
                                    </button>
                                </form>
                            </div>
                            <h1 className={"text-red-500"}>
                                {error.addUser ? "Error adding a user" : ""}
                            </h1>
                        </div>
                    }
                </div>
            </div>
            <div className={"flex flex-col rounded-2xl bg-gray-900 p-2 gap-2 max-h-[50%] mb-16"}>
                {error.users ? <div className={"text-red-500"}>Error loading users</div> :
                    users && users.map((user: any) => (
                        <div key={user.username} className={"flex flex-row items-center justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
                            <Link href={`/profile/${params.username}`} className={"w-[90%] flex flex-row justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
                                <div className={"flex flex-col"}>
                                    <div className={"font-bold text-xl"}>
                                        {user.username}
                                    </div>
                                </div>
                            </Link>
                            <form className={"flex flex-col w-[10%]"} onSubmit={removeUser}>
                                <input name={"username"} value={user.username} hidden={true} onChange={() => {}}/>
                                <button type={"submit"} className={"min-w-fit z-10 p-2 text-center font-bold text-xl rounded-xl bg-red-800"}>
                                    Remove
                                </button>
                            </form>
                            {error.removeDevice && <h1 className={"text-red-700"}>Error removing a device</h1>}
                        </div>
                ), [])}
            </div>
        </>
        )}
        </div>
    );
}

export default SystemPage;
