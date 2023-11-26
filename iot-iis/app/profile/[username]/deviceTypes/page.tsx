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
    const params = useParams();
    const [error, setError] = useState(false);

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
        if (status === "authenticated") {
            fetchData().then(r => {
                setTypes(r);
                console.log(r);
            });
        } else if (status === "unauthenticated") {
            // router.push("/profile/login");
        }
    }, [status])

    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>

    // return (<></>)

    if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
        return (
            <div className={"flex flex-col w-full p-2"}>
                <div className={"flex flex-row p-5 justify-between"}>
                    <h1 className={"font-bold text-2xl"}>
                        Device types
                    </h1>
                </div>
                <div className={"flex flex-col rounded-2xl bg-gray-900 p-2 gap-2"}>
                    {error ? <div className={"text-red-500"}>Error loading types</div> :
                        types.map((type: any) => (
                            <Link key={type.deviceId} href={`/profile/${params.username}/devices/${type.deviceId}`}
                                  className={"flex flex-row justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
                                <div className={"flex flex-col"}>
                                    <div className={"font-bold text-xl"}>
                                        {type.name}
                                    </div>
                                </div>
                                {/*<div className={"max-w-[65%]"}>*/}
                                {/*grid grid-rows-1 grid-cols-[repeat(${device.values.length}, minmax(0, 1fr))]*/}
                                <div className={`${type.parameters.length === 0 ? "hidden" : ""} flex flex-row min-w-fit max-w-full gap-2 rounded-lg shadow border md:mt-0 sm:max-w-md bg-gray-700 border-gray-800 p-2 overflow-x-auto overflow-y-hidden`}>
                                    { type.parameters.map((parameter: any) => (
                                        newParam(parameter)
                                    ))}
                                </div>
                            </Link>
                        ), [])}
                </div>
            </div>
        );
    } else {
        return redirect("/profile/login")
    }
}

export default DeviceTypePage