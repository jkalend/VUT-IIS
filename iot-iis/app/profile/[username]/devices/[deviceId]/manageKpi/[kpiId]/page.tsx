// @ts-nocheck
"use client";
import {useRouter, useParams, redirect} from "next/navigation";
import { useSession } from "next-auth/react";
import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import Link from "next/link";

const EditKpiPage = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession()
    const [formValues, setFormValues] = useState({
        threshold: "",
    });
    const [parameters, setParameters] = useState([] as any);
    const [typeName, setTypeName] = useState("");
    const [kpi, setKpi] = useState({} as any)
    const [error, setError] = useState("");
    const [parametersError, setParametersError] = useState(false);

    const editKPI = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
            const formData = new FormData(e.currentTarget)
            const res = await fetch(`/api/profile/${params.username}/devices/${params.deviceId}/${params.kpiId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    result: formData.get("result"),
                    relation: formData.get("relation"),
                    threshold: formData.get("threshold"),
                    parameterId: formData.get("parameter"),
                }),
            });
            if (!res.ok) {
                setError("Error editing KPI");
                return;
            }
            router.back();
        }
    }

    const getKPI = async () => {
        if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
            const res = await fetch(`/api/profile/${params.username}/devices/${params.deviceId}/${params.kpiId}`, {
                method: "Get",
                headers: {"Content-Type": "application/json"},
            });
            if (!res.ok) {
                setError("Error loading KPI");
                return;
            }
            const data = await res.json();
            return data;
        }
    }

    const getParameters = async () => {
        if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
            const deviceRes = await fetch(`/api/profile/${params.username}/devices/${params.deviceId}`, {
                method: "Get",
                headers: {"Content-Type": "application/json"},
            });
            if (!deviceRes.ok) {
                setParametersError(true)
                return;
            }

            const deviceData = await deviceRes.json();

            const res = await fetch(`/api/profile/${params.username}/devicetypes/${deviceData.device.typeId}`, {
                method: "Get",
                headers: {"Content-Type": "application/json"},
            });
            if (!res.ok) {
                setParametersError(true)
                return;
            }
            const data = await res.json();
            return data;
        }
    }

    useEffect(() => {
        if (status === "authenticated") {
            getKPI().then(r => {
                setKpi(r);
                setFormValues({
                    threshold: r.threshold,
                })
            });
            getParameters().then(r => {
                setParameters(r.parameters);
                setTypeName(r.typeName);
            });
        } else if (status === "unauthenticated") {
            router.push("/profile/login");
        }
    }, [status])

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>

    if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-screen md:h-screen lg:py-0 mr-64">
                <div
                    className="min-w-[55%] rounded-lg shadow dark:border md:mt-0 sm:max-w-md bg-gray-800 border-gray-700">
                    <form id={"kpi"} className="space-y-4 md:space-y-6 sm:p-8 min-w-screen"  onSubmit={editKPI}>
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl dark:text-white w-full">
                            Edit a KPI
                        </h1>
                        <div className={"flex flex-row gap-2 w-full justify-between"}>
                            <h1 className={"mr-8 text-xl font-bold text-white whitespace-nowrap"}>
                                For parameter:
                            </h1>
                            <select name={"parameter"} id={"parameter"}
                                    className={"flex flex-grow min-w-0 text-left border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 bg-gray-700 border-gray-600 dark:placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"}
                                    defaultValue={parametersError ? "" : kpi?.value?.parameterId}
                            >
                                {parametersError ? <option value={""} className={"max-w-full"}>Error loading parameters</option> :
                                    parameters.map((parameter: any) => (
                                        <option key={parameter.parameterId} value={parameter.parameterId}>{parameter.name}</option>
                                    ))}
                            </select>
                        </div>
                        <div className="flex grid-cols-3 grid-rows-1 justify-center gap-2">
                            <div className={"w-1/3 mt-4"}>
                                <select name={"result"} id={"result"} defaultValue={kpi.result}
                                        className={"flex flex-grow min-w-0 text-left border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 bg-gray-700 border-gray-600 dark:placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"}>
                                    <option value={"OK"} className={"max-w-full"}>OK</option>
                                    <option value={"ERROR"}>ERROR</option>
                                </select>
                            </div>
                            <div className="flex flex-row mt-6 whitespace-nowrap">
                                <h2>when value</h2>
                            </div>
                            <div className="mt-4">
                                <select name={"relation"} id={"relation"} defaultValue={kpi.relation}
                                        className={"text-left border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-max p-2.5 bg-gray-700 border-gray-600 dark:placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"} required>
                                    <option value={'>'}>{'>'}</option>
                                    <option value={'<'}>{'<'}</option>
                                    <option value={'='}>{'='}</option>
                                    <option value={'!='}>{'!='}</option>
                                    <option value={'>='}>{'>='}</option>
                                    <option value={'<='}>{'<='}</option>
                                </select>
                            </div>
                            <div className="mt-4">
                                <input type="threshold" name="threshold" id="threshold" placeholder={kpi.threshold} value={formValues.threshold}
                                       className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 bg-gray-700 border-gray-600 dark:placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                                       onChange={handleChange}/>
                            </div>
                        </div>
                        {error && <div className={"text-red-500 w-full text-center"}>{error}</div>}
                        <div className={"flex flex-row gap-2"}>
                            <button type={"submit"} className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Edit KPI</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    } else {
        return redirect("/profile/login")
    }
}

export default EditKpiPage;
