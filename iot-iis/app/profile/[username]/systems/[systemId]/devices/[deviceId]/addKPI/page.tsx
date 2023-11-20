"use client"
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {ChangeEvent, useEffect, useState} from "react";


const AddKPIPage = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession()
    const [devices, setDevices] = useState([])
    const [kpi, setKpi] = useState({
        deviceId: "",
        relation: "",
        threshold: "",
        result: "",
    });

    const getDevices = async () => {
        if (!session) return;
        // @ts-ignore
        const res = await fetch(`/api/profile/${session.user?.userId}/devices`, {
            method: "Get",
            headers: { "Content-Type": "application/json" },
        });
        //if (!res.ok) throw new Error("Failed to fetch devices");
        const data = await res.json();
        //console.log(data);
        return data;
    }

    const createKPI = async (e: any) => {
        e.preventDefault()
        if (!session) return;
        // @ts-ignore
        const res = await fetch(`/api/profile/${session.user?.userId}/systems/${params.systemId}/kpi`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(kpi),
        });
        //if (!res.ok) throw new Error("Failed to fetch devices");
        const data = await res.json();
        console.log(data);
        router.push(`/profile/${session.user?.username}/systems/${params.systemId}`);
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

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setKpi({ ...kpi, [name]: value });
    };


    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen mx-auto md:h-screen lg:py-0 mr-64">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl dark:text-white">
                        Device details
                    </h1>
                    <form className="space-y-4 md:space-y-6 flex flex-col" onSubmit={createKPI}>
                        <h1>VALUE</h1>
                        <select name={"deviceId"} id={"devices"}>
                            {devices.map((device: any) => (
                                <option key={device.id} value={device.deviceId}>{device.alias}</option>
                            ))}
                        </select>
                        <input type="threshold" name="threshold" id="threshold" className="bg-gray-50 border border-orange-900 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-400 dark:focus:border-orange-900" onChange={handleChange}/>
                        <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddKPIPage