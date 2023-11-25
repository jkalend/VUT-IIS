"use client";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {useEffect, useState} from "react";
import {Session} from "next-auth";
import Link from "next/link";

const DevicesPage = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession()
    const [devices, setDevices] = useState([]);

    const fetchData = async () => {
        if (!session) return;
        const res = await fetch(`/api/profile/${params.username}/devices`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        return data;
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

    return (
        <div className={"flex flex-col w-full p-2"}>
            <div className={"flex flex-row p-5 justify-between"}>
                <h1 className={"font-bold text-2xl"}>
                    Devices
                </h1>
                <Link href={`/profile/${session?.user?.username}/devices/createDevice`} className={"p-2 rounded-2xl bg-green-950"}>
                    Add device
                </Link>
            </div>
            <div className={"flex flex-col rounded-2xl bg-gray-900 p-2 gap-2"}>
                {devices.map((device: any) => (
                    <Link key={device.deviceId} href={`/profile/${session?.user?.username}/devices/${device.deviceId}`} className={"flex flex-row justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
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
        </div>
    );
}

export default DevicesPage;
