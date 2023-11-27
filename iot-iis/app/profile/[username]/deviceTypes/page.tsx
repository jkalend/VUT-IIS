// @ts-nocheck
"use client"
import React, {ChangeEvent, useEffect, useState} from 'react'
import {signIn, useSession} from 'next-auth/react'
import {redirect, useParams} from 'next/navigation'
import Link from "next/link";

type Parameter = {
    name: string,
    unit: string,
    parameterId: number,
    valuesFrom: number,
    valuesTo: number,
}

const DeviceTypePage = () => {
    const { data: session, status } = useSession()
    const [types, setTypes] = useState([]);
    const [deleted , setDeleted] = useState(true);
    const params = useParams();
    const [error, setError] = useState(false);
    const [deleteError, setDeleteError] = useState(-1);

    const deleteType = async (e: any) => {
        e.preventDefault()
        if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
            const formData = new FormData(e.currentTarget)
            const res = await fetch(`/api/profile/${params.username}/devicetypes/${formData.get("typeId")}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
            });
            if (!res.ok) {
                setDeleteError(Number(formData.get("typeId")));
                return;
            }
            setTypes(types.filter((type: any) => type.deviceId != formData.get("deviceId")));
        }
    }

    const newParam = (parameter : Parameter) => {
        return (
            <div key={parameter.parameterId} className={"flex flex-col mb-2 text-left border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 h-full p-2.5 bg-gray-700 border-gray-600 dark:placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"}>
                <h1 className={"w-full text-sm font-bold"}>
                    {parameter.name}
                </h1>
                <div className={"flex flex-row w-full gap-1 text-xs"}>
                    <h1>
                        {parameter.valuesFrom} - {parameter.valuesTo}
                    </h1>
                    <h2>
                       in {parameter.unit}
                    </h2>
                </div>
            </div>
        )
    }

    const fetchData = async () => {
        if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
            const res = await fetch(`/api/profile/${params.username}/devicetypes`, {
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
        if (status === "authenticated" && deleted) {
            fetchData().then(r => {
                setTypes(r);
            });
            setDeleted(false)
        } else if (status === "unauthenticated") {
            // router.push("/profile/login");
        }
        setDeleteError(-1)
    }, [status, types])

    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>


    if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
        return (
            <div className={"flex flex-col w-full p-2"}>
                <div className={"flex flex-row p-5 justify-between"}>
                    <h1 className={"font-bold text-2xl"}>
                        Device types
                    </h1>
                </div>
                <div className={"flex flex-col rounded-2xl bg-gray-900 p-2 gap-2 overflow-x-hidden overflow-y-auto mb-16"}>
                    {error ? <div className={"text-red-500"}>Error loading types</div> :
                        types.map((type: any) => (
                            <div key={type.typeId} className={"flex-col flex"}>
                            <div className={"flex flex-row justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
                                <div className={"flex flex-col"}>
                                    <div className={"font-bold text-xl"}>
                                        {type.name}
                                    </div>
                                </div>
                                <div className={"flex flex-row gap-2"}>
                                    <div className={`${type.parameters.length === 0 ? "hidden" : ""} flex flex-row min-w-fit max-w-full gap-2 rounded-lg shadow border md:mt-0 sm:max-w-md bg-gray-700 border-gray-800 p-2 overflow-x-auto overflow-y-hidden`}>
                                        { type.parameters.map((parameter: any) => (
                                            newParam(parameter)
                                        ))}
                                    </div>
                                    <form className={"flex justify-center items-center gap-1 max-w-fit max-h-fit"} onSubmit={deleteType}>
                                        <input name={"typeId"} value={type.typeId} hidden={true} onChange={() => {}}/>
                                        <button type={"submit"} className={"z-10 p-2 text-center font-bold text-xl rounded-xl bg-red-800"}>
                                            Remove
                                        </button>
                                    </form>
                                </div>
                            </div>
                                {deleteError == type.typeId ? <div className={"text-red-500"}>Error deleting type, likely because the type is linked to a device</div> : <></>}
                            </div>
                        ), [])}
                </div>

            </div>
        );
    } else {
        return redirect("/profile/login")
    }
}

export default DeviceTypePage