"use client";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {ChangeEvent, useEffect, useState} from "react";
// import {useRouter} from "next/router";
import Link from "next/link";

const DeviceDetailsPage = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession()
    const [device, setDevice] = useState({} as any);
    const [edit, setEdit] = useState(false);
    const [formValues, setFormValues] = useState({
        alias: "",
        typus: "",
        description: "",
    });

    const getDevice = async () => {
        if (!session) return;
        // @ts-ignore
        const res = await fetch(`/api/profile/${session.user?.userId}/devices/${params.deviceId}`, {
            method: "Get",
            headers: { "Content-Type": "application/json" },
        });
        //if (!res.ok) throw new Error("Failed to fetch devices");
        const data = await res.json();
        //console.log(data);
        return data;
    }

    const editDevice = async () => {
        if (!session) return;
        // @ts-ignore
        const res = await fetch(`/api/profile/${session.user?.userId}/devices/${params.deviceId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formValues),
        });
        //if (!res.ok) throw new Error("Failed to fetch devices");
        const data = await res.json();
        console.log(data);
        setEdit(false);
    }

    const deleteDevice = async (e: any) => {
        e.preventDefault()
        if (!session) return;
        // @ts-ignore
        const res = await fetch(`/api/profile/${session.user?.userId}/devices/${params.deviceId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        //if (!res.ok) throw new Error("Failed to fetch devices");
        const data = await res.json();
        console.log(data);
        router.push(`/profile/${session.user?.username}/devices/`);
    }

    useEffect(() => {
        if (status === "authenticated") {
            getDevice().then(r => {
                setDevice(r);
            });
        } else if (status === "unauthenticated") {
            router.push("/profile/login");
        }
    }, [status])

    const handleEdit = (event: any) => {
        setEdit(!edit);

        //console.log('value is:', event.target.value);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen mx-auto md:h-screen lg:py-0 mr-64">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <div className={"flex flex-row gap-2 w-full justify-between"}>
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl dark:text-white">
                            Device details
                        </h1>
                        <h1 className={"mr-8 text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl dark:text-white"}>
                            KPI: {""}
                        </h1>
                    </div>
                    {edit ? (
                        <form className="space-y-4 md:space-y-6" onSubmit={editDevice}>
                            <div>
                                <label htmlFor="alias" className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Device Alias</label>
                                <input type="alias" name="alias" id="alias" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={device.alias} onChange={handleChange}/>
                            </div>
                            <div>
                                <label htmlFor="typus" className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Device type</label>
                                <input type="typus" name="typus" id="typus" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={device.typus} onChange={handleChange}/>
                            </div>
                            <div>
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                <input type="description" name="description" id="description" placeholder={device.description} className="bg-gray-50 border border-orange-900 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-400 dark:focus:border-orange-900" onChange={handleChange}/>
                            </div>
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Accept</button>
                        </form>
                    ) : (
                        <div className="space-y-4 md:space-y-6">
                            <div>
                                <label htmlFor="alias" className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Device Alias</label>
                                <span id="alias" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    {device.alias}
                                </span>
                            </div>
                            <div>
                                <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Device type</label>
                                <span id="type" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    {device.typus}
                                </span>
                            </div>
                            <div>
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                <span id="description" className="bg-gray-50 border border-orange-900 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-400 dark:focus:border-orange-900">
                                    {device.description}
                                </span>
                            </div>
                            <button onClick={handleEdit} className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Edit</button>
                            <button onClick={deleteDevice} className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Delete</button>
                            <div className={"flex flex-row gap-2"}>
                                <Link href={`/profile/${session?.user?.username}/devices/${params.deviceId}/kpi`} className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Add KPI</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DeviceDetailsPage;
