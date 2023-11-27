// @ts-nocheck
"use client";
import {useRouter, useParams, redirect} from "next/navigation";
import { useSession } from "next-auth/react";
import {useEffect, useState} from "react";
import Link from "next/link";

type Value = {
    parameter: {
        name: string,
        unit: string,
        precision: number,
    },
    recentValue: string,
    valueId: number,
}

const DevicesPage = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession()
    const [devices, setDevices] = useState([]);
    const [error, setError] = useState(false);

    const newValue = (value : Value) => {
        return (
            <div key={value.valueId} className={"flex flex-col mb-2 text-left border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 h-full p-2.5 bg-gray-700 border-gray-600 dark:placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"}>
                <h1 className={"w-full text-sm font-bold"}>
                    {value.parameter.name}
                </h1>
                <div className={"flex flex-row w-full gap-1 text-xs"}>
                    <h1>
                        {value.recentValue.toFixed(value.parameter.precision)}
                    </h1>
                    <h2>
                        {value.parameter.unit}
                    </h2>
                </div>
            </div>
        )
    }

    const fetchData = async () => {
        if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
            const res = await fetch(`/api/profile/${params.username}/devices`, {
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
            fetchData().then(r => {
                setDevices(r);
            });
        } else if (status === "unauthenticated") {
            router.push("/profile/login");
        }
    }, [status])

    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>

    if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
        return (
            <>
            <div className={"flex flex-col w-full p-2 overflow-y-auto overflow-x-hidden mb-16"}>
                <div className={"flex flex-row p-5 justify-between"}>
                    <h1 className={"font-bold text-2xl"}>
                        Devices
                    </h1>
                    <Link href={`/profile/${params.username}/devices/createDevice`}
                          className={"p-2 rounded-2xl bg-green-950"}>
                        Add device
                    </Link>
                </div>
                <div className={"flex flex-col rounded-2xl bg-gray-900 p-2 gap-2"}>
                    {error ? <div className={"text-red-500"}>Error loading devices</div> :
                    devices.map((device: any) => (
                        <Link key={device.deviceId} href={`/profile/${params.username}/devices/${device.deviceId}`}
                              className={"flex flex-row justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
                            <div className={"flex flex-col gap-1"}>
                                <div className={"flex flex-row gap-5 justify-center items-center max-w-full"}>
                                    <div className={"font-bold text-xl max-w-screen-md truncate"}>
                                        {device.alias}
                                    </div>
                                    <div className={"font-bold text-gray-500 max-w-[40vmin] truncate"}>
                                        {device.deviceType.name}
                                    </div>
                                </div>
                                <h2 className={"text-gray-500 max-w-screen-md"}>
                                    {device.description}
                                </h2>
                            </div>
                            <div className={`${device.values.length === 0 ? "hidden" : ""} flex flex-row min-w-fit max-w-full gap-2 rounded-lg shadow border md:mt-0 sm:max-w-md bg-gray-700 border-gray-800 p-2 overflow-x-auto overflow-y-hidden`}>
                                { device.values.map((value: any) => (
                                    newValue(value)
                                ))}
                            </div>
                        </Link>
                    ), [])}
                </div>
            </div>
            </>
        );
    } else {
        return redirect("/profile/login")
    }
}

export default DevicesPage;
