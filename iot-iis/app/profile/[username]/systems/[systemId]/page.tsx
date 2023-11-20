"use client";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import Link from "next/link";
// import {useRouter} from "next/router";

const SystemPage = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession()
    const [devices, setDevices] = useState([]);
    const [allDevices, setAllDevices] = useState([]);
    const [dropdown, setDropdown] = useState(false);
    const [system, setSystem] = useState({} as any);
    const [edit, setEdit] = useState(false);
    const [editValues, setEditValues] = useState({
        name: "",
        description: "",
    });
    const [kpi, setKpi] = useState({
        deviceId: "",
        relation: "",
        threshold: "",
        result: "",
    });

    const fetchDevices = async () => {
        if (!session) return;
        const res = await fetch(`/api/profile/${session.user?.userId}/devices`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        //if (!res.ok) throw new Error("Failed to fetch devices");
        const data = await res.json();

        //filter for null systemId
        const filteredData = data.filter((device: any) => device.systemId === null)
        return filteredData;
    }

    useEffect(() => {
        if (status === "authenticated") {
            fetchDevices().then(r => {
                setAllDevices(r);
            });
        } else if (status === "unauthenticated") {
            router.push("/profile/login");
        }
    }, [status])

    const addDevice = async (e : FormEvent<HTMLFormElement>) => {
        //e.preventDefault();
        if (!session) return;
        // @ts-ignore
        const formData = new FormData(e.currentTarget)
        console.log(formData)
        const res = await fetch(`/api/profile/${session.user?.userId}/systems/${params.systemId}/devices`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                deviceId: formData.get("deviceId"),
            }),
        });
        //if (!res.ok) throw new Error("Failed to fetch devices");
        const data = await res.json();
        console.log(data);
        // @ts-ignore
        router.refresh()
        // router.push(`/profile/${session.user?.username}/systems/`);

    }

    const getDevices = async () => {
        if (!session) return;
        // @ts-ignore
        const res = await fetch(`/api/profile/${session.user?.userId}/systems/${params.systemId}/devices`, {
            method: "Get",
            headers: { "Content-Type": "application/json" },
        });
        //if (!res.ok) throw new Error("Failed to fetch devices");
        const data = await res.json();
        //console.log(data);
        return data;
    }

    const editSystem = async () => {
        if (!session) return;
        // @ts-ignore
        const res = await fetch(`/api/profile/${session.user?.userId}/systems/${params.systemID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editValues),
        });
        //if (!res.ok) throw new Error("Failed to fetch devices");
        const data = await res.json();
        console.log(data);
        setEdit(false);
    }

    const deleteSystem = async (e: any) => {
        e.preventDefault()
        if (!session) return;
        // @ts-ignore
        const res = await fetch(`/api/profile/${session.user?.userId}/systems/${params.systemId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        //if (!res.ok) throw new Error("Failed to fetch devices");
        const data = await res.json();
        console.log(data);
        router.push(`/profile/${session.user?.username}/systems`);
    }

    useEffect(() => {
        if (status === "authenticated") {
            getDevices().then(r => {
                setDevices(r);
            });
        } else if (status === "unauthenticated") {
            //router.push("/profile/login");
        }
    }, [status])

    // const handleEdit = (event: any) => {
    //     setEdit(!edit);
    // };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEditValues({ ...editValues, [name]: value });
    };

    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>

    return (
        <div className={"flex flex-col w-full p-2"}>
            <div className={"flex flex-row p-5 justify-between"}>
                <h1 className={"font-bold text-2xl"}>
                    Devices
                </h1>
                <div className={"flex flex-row gap-2"}>
                    <button onClick={() => setDropdown(!dropdown)} className={"p-2 rounded-2xl bg-green-950"}>
                        Add device
                    </button>
                    {dropdown &&
                        <div className={"flex flex-col gap-2"}>
                            <form onSubmit={addDevice} >
                            <select name={"deviceId"} id={"deviceId"} className={"text-white bg-gray-700 rounded-2xl"}>
                                {allDevices.map((device: any) => (
                                    <option key={device.id} value={device.deviceId}>{device.alias}</option>
                                ))}
                            </select>
                            <button type="submit" className={"p-2 rounded-2xl bg-green-950"}>
                                Add
                            </button>
                            </form>
                        </div>
                    }
                    <Link href={`/profile/${session?.user?.username}/systems/${params.systemId}`} className={"p-2 rounded-2xl bg-green-950"}>
                        Add KPI
                    </Link>
                </div>
            </div>
            <div className={"flex flex-col rounded-2xl bg-gray-900 p-2 gap-2"}>
                {devices.map((device: any) => (
                    <Link key={device.id} href={`/profile/${session?.user?.username}/devices/${device.deviceId}`} className={"flex flex-row justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
                        <div className={"flex flex-col"}>
                            <div className={"font-bold text-xl"}>
                                {device.alias}
                            </div>
                            <h1 className={"text-gray-500"}>
                                {device.typus}
                            </h1>
                        </div>
                        <div className={"flex flex-col"}>
                            <h1 className={"font-bold text-xl"}>
                                {device.recentValue}
                            </h1>
                        </div>
                    </Link>
                ), [])}
            </div>
        </div>
    );
}

export default SystemPage;
