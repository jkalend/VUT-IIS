// @ts-nocheck
"use client";
import {useRouter, useParams, redirect} from "next/navigation";
import { useSession } from "next-auth/react";
import React, {ChangeEvent, useEffect, useState} from "react";
import Link from "next/link";
import {set} from "yaml/dist/schema/yaml-1.1/set";

const ManageKpiPage = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession()
    const [kpis, setKpis] = useState([] as any);
    const [deleted , setDeleted] = useState(true);
    const [formValues, setFormValues] = useState({
        alias: "",
        type: "",
        description: "",
    });
    const [error, setError] = useState({
        device: false,
        type: false,
        edit: false,
        deleteKPI: false,
    });

    const getKPIs = async () => {
        if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
            const res = await fetch(`/api/profile/${params.username}/devices/${params.deviceId}/kpis`, {
                method: "Get",
                headers: {"Content-Type": "application/json"},
            });
            if (!res.ok) {
                setError({...error, device: true});
                return;
            }
            const data = await res.json();
            return data;
        }
    }

    const deleteKPI = async (e: any) => {
        e.preventDefault()
        if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
            const formData = new FormData(e.currentTarget)
            const res = await fetch(`/api/profile/${params.username}/devices/${params.deviceId}/${formData.get("kpiId")}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
            });
            if (!res.ok) {
                setError({...error, deleteKPI: true});
                return;
            }
            setDeleted(true);
        }
    }

    useEffect(() => {
        if (status === "authenticated" && deleted) {
            getKPIs().then(r => {
                setKpis(r);
                setDeleted(false);
            });
        } else if (status === "unauthenticated") {
            router.push("/profile/login");
        }
        setError({...error, type: false, edit: false, deleteKPI: false})
    }, [status, kpis, error, deleted, getKPIs, router])

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>

    if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-screen mx-auto md:h-screen lg:py-0 mr-64">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <div className={"flex flex-row gap-2 w-full justify-between"}>
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl dark:text-white">
                                Device KPIs
                            </h1>
                        </div>
                        <div className="space-y-4 md:space-y-6">
                            {error.device ? <div className={"text-red-500"}>Error loading KPIs</div> :
                                kpis && kpis.map((kpi: any) => (
                                    <div key={kpi.kpiId} className={"flex flex-row items-center justify-between p-5 rounded-2xl bg-gray-700 py-2"}>
                                        <div className={"flex flex-col justify-between p-2 rounded-2xl bg-gray-700 py-2"}>
                                            <h1 className={"flex flex-col text-base"}>
                                                {kpi.result} when {kpi.value.parameter.name}:
                                            </h1>
                                            <div className={"flex flex-col pl-3"}>
                                                <h1 className={"text-sm text-gray-300"}>
                                                    Value ( {kpi.value.recentValue} ) {kpi.relation} {kpi.threshold}
                                                </h1>
                                            </div>
                                        </div>
                                        <form className={"flex flex-row gap-1"} onSubmit={deleteKPI}>
                                            <Link href={`/profile/${params.username}/devices/${params.deviceId}/manageKpi/${kpi.kpiId}`} className="z-10 p-2 text-center font-bold text-xl rounded-xl bg-red-800">Edit</Link>
                                            <input name={"kpiId"} value={kpi.kpiId} hidden={true} onChange={() => {}}/>
                                            <button type={"submit"} className={"z-10 p-2 text-center font-bold text-xl rounded-xl bg-red-800"}>
                                                Remove
                                            </button>
                                        </form>
                                        {error.deleteKPI && <h1 className={"text-red-700"}>Error removing a device</h1>}
                                    </div>
                                ), [])}
                            <div className={"flex flex-row gap-2"}>
                                <Link href={`/profile/${params.username}/devices/${params.deviceId}/kpi`} className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Add KPI</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return redirect("/profile/login")
    }
}

export default ManageKpiPage;
