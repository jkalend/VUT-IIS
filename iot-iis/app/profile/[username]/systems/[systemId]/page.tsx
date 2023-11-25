"use client";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import Link from "next/link";
// import {useRouter} from "next/router";

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

    const fetchDevices = async () => {
        if (!session) return;
        const res = await fetch(`/api/profile/${params.username}/devices`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        //if (!res.ok) throw new Error("Failed to fetch devices");
        const data = await res.json();

        //filter for null systemId
        const filteredData = data.filter((device: any) => device.systemId === null)
        return filteredData;
    }

    // useEffect(() => {
    //     if (status === "authenticated") {
    //         fetchDevices().then(r => {
    //             setAllDevices(r);
    //         });
    //     } else if (status === "unauthenticated") {
    //         router.push("/profile/login");
    //     }
    // }, [status])

    const addDevice = async (e : FormEvent<HTMLFormElement>) => {
        if (!session) return;
        const formData = new FormData(e.currentTarget)
        const res = await fetch(`/api/profile/${params.username}/systems/${params.systemId}/devices`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                deviceId: formData.get("deviceId"),
            }),
        });
        // const data = await res.json();
        router.refresh()
    }

    const getDevices = async () => {
        if (!session) return;
        const res = await fetch(`/api/profile/${params.username}/systems/${params.systemId}/devices`, {
            method: "Get",
            headers: {"Content-Type": "application/json"},
        });
        const data = await res.json();
        return data;
    }

    const getSystem = async () => {
        if (!session) return;
        const res = await fetch(`/api/profile/${params.username}/systems/${params.systemId}`, {
            method: "Get",
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        return data;
    }

    const getUsers = async () => {
        if (!session) return;
        const res = await fetch(`/api/profile/${params.username}/systems/${params.systemId}/share`, {
            method: "Get",
            headers: { "Content-Type": "application/json" },
        });
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
                username: formData.get("username"),
            }),
        });
        // const data = await res.json();
        router.refresh()
    }

    const removeUser = async (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!session) return;
        const formData = new FormData(e.currentTarget)
        const res = await fetch(`/api/profile/${params.username}/systems/${params.systemId}/share`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: formData.get("username"),
            }),
        });
        // const data = await res.json();
        router.refresh()
    }

    useEffect(() => {
        if (status === "authenticated") {
            fetchDevices().then(r => {
                setAllDevices(r);
            });
            getDevices().then(r => {
                setDevices(r);
            });
            getSystem().then(r => {
                setSystem(r);
            });
            getUsers().then(r => {
                setUsers(r.allowed_users);
            });
        } else if (status === "unauthenticated") {
            //router.push("/profile/login");
        }
    }, [status])

    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>

    return (
        <div className={"flex flex-col w-full p-2"}>
            <div className={"flex flex-row p-5 justify-between"}>
                <div className={"flex flex-row gap-2"}>
                    <h1 className={"font-bold text-2xl"}>
                        System
                    </h1>
                    <h1 className={"font-bold text-2xl text-orange-400"}>
                        {system.name}
                    </h1>
                </div>
                <Link href={`/profile/${params.username}/systems/${params.systemId}/editSystem`} className={"p-2 rounded-2xl bg-orange-500"}>
                    Edit system
                </Link>
            </div>
            <div className={"flex flex-row p-5 justify-between"}>
                <h1 className={"font-bold text-2xl"}>
                    Devices
                </h1>
                <div className={"flex flex-row gap-2"}>
                    <button onClick={() => setDropdown(!dropdown)} className={"p-2 rounded-2xl bg-green-950"}>
                        {dropdown ? "Close" : "Add device"}
                    </button>
                    {dropdown &&
                        <div className={"flex flex-col gap-2"}>
                            <form onSubmit={addDevice} className={"flex flex-row gap-2"}>
                            <select name={"deviceId"} id={"deviceId"} className={"text-white bg-gray-700 rounded-2xl w-fit"}>
                                {allDevices.map((device: any) => (
                                    <option key={device.deviceId} value={device.deviceId}>{device.alias}</option>
                                ))}
                            </select>
                            <button type="submit" className={"p-2 rounded-2xl bg-green-950"}>
                                Add
                            </button>
                            </form>
                        </div>
                    }
                </div>
            </div>
            <div className={"flex flex-col rounded-2xl bg-gray-900 p-2 gap-2 overflow-auto max-h-[50%]"}>
                {devices.map((device: any) => (
                    <Link key={device.deviceId} href={`/profile/${params.username}/devices/${device.deviceId}`} className={"flex flex-row justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
                        <div className={"flex flex-col"}>
                            <div className={"font-bold text-xl"}>
                                {device.alias}
                            </div>
                            <h1 className={"text-gray-500"}>
                                {device.typus}
                            </h1>
                        </div>
                        {/*
                        <div className={"flex flex-col"}>
                            <h1 className={"font-bold text-xl"}>
                                {device.recentValue}
                            </h1>
                        </div>
                        */}
                    </Link>
                ), [])}
            </div>
            <div className={"flex flex-row p-5 justify-between mt-32"}>
                <h1 className={"font-bold text-2xl"}>
                    Users
                </h1>
                <div className={"flex flex-row gap-2"}>
                    <button onClick={() => setDropdown2(!dropdown2)} className={"p-2 rounded-2xl bg-green-950"}>
                        {dropdown2 ? "Close" : "Add user"}
                    </button>
                    {dropdown2 &&
                        <div className={"flex flex-col gap-2"}>
                            <form onSubmit={addShare} className={"flex flex-row gap-2"}>
                                <input name={"username"} id={"usernameADD"} type={"text"} placeholder={"Username"}
                                       className={"text-white bg-gray-700 rounded-2xl p-2"}/>
                                <button type="submit" className={"p-2 rounded-2xl bg-green-950"}>
                                    Add
                                </button>
                            </form>
                        </div>
                    }
                </div>
            </div>
            <div className={"flex flex-col rounded-2xl bg-gray-900 p-2 gap-2 max-h-[50%] pb-16"}>
                {users && users.map((user: any) => (
                    <Link key={user.username} href={`/profile/${params.username}/`} className={"flex flex-row justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
                        <div className={"flex flex-col truncate p-2"}>
                            <div className={"font-bold text-xl truncate"}>
                                {user.username}
                            </div>
                        </div>
                        <div className={"flex flex-col"}>
                            <button className={"p-2 text-center font-bold text-xl rounded-xl bg-red-800"}>
                                Remove
                            </button>
                        </div>
                    </Link>
                ), [])}
            </div>
        </div>
    );
}

export default SystemPage;
