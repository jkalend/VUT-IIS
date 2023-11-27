// @ts-nocheck
"use client"
import React, {ChangeEvent, useEffect, useState} from 'react'
import {signIn, useSession} from 'next-auth/react'
import {useParams, useRouter} from 'next/navigation'
import Link from "next/link";

const UserProfile = () => {
    const params = useParams();
    const {data: session, status} = useSession()
    const [devices, setDevices] = useState([]);
    const [systems, setSystems] = useState([]);
    const [counts, setCounts] = useState({
        devices: 0,
        systems: 0,
    });
    const [error, setError] = useState(false);
    const [systemsError, setSystemsError] = useState(false);
    const [devicesError, setDevicesError] = useState(false);

    const fetchCounts = async () => {
        const user = session?.user?.username === params.username ? session.user?.username : params.username;
        const res = await fetch(`/api/profile/${user}/`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
        if (!res.ok) {
            setError(true);
            return { devices: 0, systems: 0 };
        }
        const data = await res.json();
        return data;
    }
    const fetchData = async () => {
        const user = session?.user?.username === params.username ? session.user?.username : params.username;
        const res = await fetch(`/api/profile/${user}/devices`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
        if (!res.ok) {
            setDevicesError(true);
            return [];
        }
        const data = await res.json();
        return data;
    }

    const fetchSystems = async () => {
        const user = session?.user?.username === params.username ? session.user?.username : params.username;
        const res = await fetch(`/api/profile/${user}/systems`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
        const data = await res.json();
        if (!res.ok) {
            setSystemsError(true);
            return [];
        }
        return data;
    }

    useEffect(() => {
        if (status === "authenticated" && (session?.user?.username === params.username || session?.is_admin == 1)) {
            fetchData().then(r => {
                setDevices(r);
            });
            fetchSystems().then(r => {
                setSystems(r);
            });
        } else {
            fetchCounts().then(r => {
                setCounts(r);
            });
        }
        // console.log("mainpage");
    }, [status])

    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>

    if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
        return (
            <div className={"flex flex-row w-full"}>
                <div className={"flex flex-col w-full p-2"}>
                    <div className={"flex flex-row p-5 justify-between"}>
                        <h1 className={"font-bold text-2xl"}>
                            Devices
                        </h1>
                    </div>
                    <div className={"flex flex-col rounded-2xl bg-gray-900 p-2 gap-2 overflow-x-hidden overflow-y-auto mb-16"}>
                        {devicesError ? <div className={"text-red-500"}>Error loading devices</div> :
                            devices.map((device: any) => (
                            <Link key={device.deviceId}
                                  href={`/profile/${params.username}/devices/${device.deviceId}`}
                                  className={"flex flex-row justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
                                <div className={"flex flex-col"}>
                                    <div className={"font-bold text-xl max-w-screen-sm truncate"}>
                                        {device.alias}
                                    </div>
                                    <h1 className={"text-gray-500 max-w-screen-sm truncate"}>
                                        {device.deviceType.name}
                                    </h1>
                                </div>
                                {/*<div className={"flex flex-col"}>*/}
                                {/*    <h1 className={"font-bold text-xl"}>*/}
                                {/*        {device.recentValue}*/}
                                {/*    </h1>*/}
                                {/*</div>*/}
                            </Link>
                        ), [])}
                    </div>
                </div>
                <div className={"flex flex-col w-full p-2"}>
                    <div className={"flex flex-row p-5 justify-between"}>
                        <h1 className={"font-bold text-2xl"}>
                            Systems
                        </h1>
                    </div>
                    <div className={"flex flex-col rounded-2xl bg-gray-900 p-2 gap-2 overflow-x-hidden overflow-y-auto mb-16"}>
                        {systemsError ? <div className={"text-red-500"}>Error loading systems</div> :
                            systems.map((system: any) => (
                            <Link key={system.systemId}
                                  href={`/profile/${params.username}/systems/${system.systemId}`}
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
            </div>
        );
    } else {
        return (
            <div
                className="flex flex-col items-center justify-center h-screen w-screen mx-auto md:h-screen lg:py-0 mr-64">
                <div className={"flex flex-row p-5 justify-between gap-2"}>
                    <h1 className={"font-bold text-2xl"}>
                        User
                    </h1>
                    <h1 className={"font-bold text-2xl text-orange-400"}>
                        {params.username}
                    </h1>
                    <h1 className={"font-bold text-2xl"}>
                        devices & systems metadata
                    </h1>
                </div>
                <div
                    className={"grid grid-cols-2 grid-rows-2 rounded-2xl bg-gray-900 p-2 gap-2 space-x-2 overflow-y-auto mb-16"}>
                    <h1 className={"font-bold text-xl"}>
                        Devices
                    </h1>
                    <h1 className={"font-bold text-xl"}>
                        Systems
                    </h1>
                    <h1 className={"text-gray-500 text-center"}>
                        {counts.devices}
                    </h1>
                    <h1 className={"text-gray-500 text-center"}>
                        {counts.systems}
                    </h1>
                </div>
            </div>
        )
    }

}

export default UserProfile