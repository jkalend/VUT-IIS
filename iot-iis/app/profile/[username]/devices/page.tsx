"use client";
import {useRouter, useParams, redirect} from "next/navigation";
import { useSession } from "next-auth/react";
import {useEffect, useState} from "react";
import Link from "next/link";

const DevicesPage = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession()
    const [devices, setDevices] = useState([]);
    const [error, setError] = useState(false);

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
            <div className={"flex flex-col w-full p-2"}>
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
                            <div className={"flex flex-col"}>
                                <div className={"font-bold text-xl"}>
                                    {device.alias}
                                </div>
                                <h1 className={"text-gray-500"}>
                                    {device.deviceType.name}
                                </h1>
                            </div>
                            <div className={"max-w-[65%]"}>
                                { device.values.map((value: any) => (
                                <div className={"flex flex-col"}>
                                    <h1 className={"font-bold text-xl"}>
                                        {value.recentValue}
                                    </h1>
                                </div>
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
