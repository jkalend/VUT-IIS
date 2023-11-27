// @ts-nocheck
"use client";
import {redirect, useParams, useRouter} from "next/navigation";
import { useSession } from "next-auth/react";
import {ChangeEvent, useEffect, useState} from "react";

type Param = {
    id: number,
    name: string,
    valuesFrom: string,
    valuesTo: string,
    precision: string,
    type: string,
}

const CreateDevicePage = () => {
    const router = useRouter();
    const params = useParams();
    const { data: session, status } = useSession()

    // selectable types
    const [deviceTypes, setDeviceTypes] = useState([]);

    // a new type is selected
    const [selectedNew, setSelectedNew] = useState(false);

    // params of the new type
    const [typeParams, setTypeParams] = useState([] as Param[]);

    // the device form
    const [form, setForm] = useState({
        alias: "",
        type: "",
        description: "",
    });

    // holds the name of the new type
    const [newType, setNewType] = useState("");

    const [error, setError] = useState("");

    const handleParams = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const paramId = name.split("-")[0];
        const paramName = name.split("-")[1];
        setTypeParams([...typeParams].map((param) => {
            if (param.id === Number(paramId)) {
                return {
                    ...param,
                    [paramName]: value,
                }
            }
            return param;
        }));
    }

    const handleNewType = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewType(value);
    }

    const addParam = (param: Param) => {
        return (
        <div id={`param-${param.id}`} key={param.id} onChange={handleParams} className={"mb-2 text-left border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 bg-gray-700 border-gray-600 dark:placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"}>
                <div className={"w-full justify-between flex flex-row"}>
                    <label htmlFor={`${param.id}-name`}
                           className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Parameter name</label>
                    <button type={"button"} className={"items-center justify-center text-center h-5 w-5 bg-gray-500 text-white rounded-lg"} onClick={() => {
                        setTypeParams([...typeParams].filter((p) => p.id !== param.id))
                    }}>X</button>
                </div>
                <input name={`${param.id}-name`} id={`${param.id}-name`} value={param.name} onChange={handleParams}
                       className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       placeholder="New Param"/>
                <div className={"flex flex-row my-2"}>
                    <h1 className={"text-center font-bold text-2xl mx-2"}>From</h1>
                    <input name={`${param.id}-valuesFrom`} id={`${param.id}-valuesFrom`} value={param.valuesFrom} onChange={handleParams}
                           className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           placeholder={"value"} required/>
                    <p className="mt-1 ml-1 text-sm font-bold text-red-800">*</p>
                    <h1 className={"text-center font-bold text-2xl mx-2"}>to</h1>
                    <input name={`${param.id}-valuesTo`} id={`${param.id}-valuesTo`} value={param.valuesTo} onChange={handleParams}
                           className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           placeholder={"value"} required/>
                    <p className="mt-1 ml-1 text-sm font-bold text-red-800">*</p>
                </div>
                <div className={"flex flex-row my-2"}>
                    <label className={"text-center font-bold text-xl mx-2 w-full whitespace-nowrap"}>With precision of</label>
                    <input name={`${param.id}-precision`} id={`${param.id}-precision`} value={param.precision} onChange={handleParams}
                           className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 bg-gray-700 border-gray-600 dark:placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                           placeholder={"2"}/>
                </div>
                <label htmlFor={`${param.id}-type`}
                       className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Measured in</label>
                <input name={`${param.id}-type`} id={`${param.id}-type`} value={param.type} onChange={handleParams}
                       className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       placeholder="Units"/>
        </div>
    )
    }

    const addType = (
        <div className={"w-full rounded-lg shadow border md:mt-0 sm:max-w-md bg-gray-700 border-gray-700 p-2"}>
            <label htmlFor="typeName"
                   className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Device Type</label>
            <input name="typeName" id="typeName" onChange={handleNewType}
                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   placeholder="New Type" value={newType} required/>
            <div className={"flex flex-row my-2 w-full justify-between"}>
            <h1 className="text-center mt-1 block mb-2 text-sm font-medium text-gray-800 dark:text-white">Parameters</h1>
            <button type={"button"} className={"bg-gray-500 text-white rounded-lg p-1.5 ml-2"} onClick={() => {setTypeParams([...typeParams, {
                id: typeParams.length,
                name: "",
                valuesFrom: "",
                valuesTo: "",
                precision: "",
                type: "",
            }])}}>Add Param</button>
            </div>
            <div className={"flex flex-col"}>
                {typeParams.map((param) => (
                    addParam(param)
                ))}
            </div>
        </div>
    )

    const addDevice = async (e : any) => {
        e.preventDefault();
        if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
            let deviceTypeId = 0;
            let deviceTypeParams = [];
            if (form.type == "new") {
                // create new device type
                const res = await fetch(`/api/profile/${params.username}/devicetypes`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        devTypeName: newType
                    }),
                });
                if (!res.ok) {
                    setError(await res.json());
                    return;
                }
                const deviceType = await res.json()
                deviceTypeId = deviceType.typeId

                // console.log("typeParams",typeParams.length)
                // create new params
                for (let i = 0; i < typeParams.length; i++) {
                    const res = await fetch(`/api/profile/${params.username}/parameters`, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            paramName: typeParams[i].name,
                            valuesFrom: Number(typeParams[i].valuesFrom),
                            valuesTo: Number(typeParams[i].valuesTo),
                            precision: Number(typeParams[i].precision),
                            deviceTypeId: Number(deviceTypeId),
                            unit: typeParams[i].type,
                        }),
                    });
                    if (!res.ok) {
                        setError("Error creating a new parameter:" + typeParams[i].name);
                        const res = await fetch(`/api/profile/${params.username}/devicetypes/${deviceTypeId}`, {
                            method: "DELETE",
                            headers: {"Content-Type": "application/json"},
                        });
                        return;
                    }
                    const res_json = await res.json()
                    deviceTypeParams.push (res_json.parameterId)
                }
            } else {
                const devtype = deviceTypes.filter((devtype) => devtype.name == form.type)[0]
                deviceTypeId = devtype.typeId
                deviceTypeParams = devtype.parameters.map (function (param) {
                    return param.parameterId
                })
            }

            const res = await fetch(`/api/profile/${params.username}/devices`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    alias: form.alias,
                    description: form.description,
                    deviceTypeId: deviceTypeId,
                }),
            });
            if (!res.ok) {
                setError("Error creating a new device");
                return;
            }
            const res_json = await res.json()
            const devId = res_json.deviceId
            // create values
            for (let i = 0; i < deviceTypeParams.length; i++) {
                const res = await fetch(`/api/profile/${params.username}/values`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        parameterId: deviceTypeParams[i],
                        deviceId: devId
                    }),
                });
                if (!res.ok) {
                    setError("Error creating a new value");
                    return;
                }
            }
            router.push(`/profile/${params.username}/devices/`);
        }
    }

    const getDeviceTypes = async () => {
        if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
            const res = await fetch(`/api/profile/${params.username}/devicetypes`, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });
            if (!res.ok) {
                setError("Error loading device types");
                return [];
            }
            const data = await res.json();
            return data;
        }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    };

    useEffect(() => {
        getDeviceTypes().then((data) => {
            setDeviceTypes(data);
        });
    }, [status]);

    useEffect(() => {
        if (form.type === "new") {
            setSelectedNew(true);
        } else {
            setSelectedNew(false);
        }
    }, [form.type]);

    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>

    if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
        return (
            <div
                className=" flex flex-col items-center justify-center h-screen w-screen mx-auto md:h-screen lg:py-0">
                <div
                    className="mb-16 w-full overflow-auto bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl dark:text-white">
                            Create a new device
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={addDevice}>
                            <div>
                                <label htmlFor="alias"
                                       className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Device
                                    Alias</label>
                                <input type="alias" name="alias" id="alias"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="My Little Device" onChange={handleChange} required/>
                                <p className="mt-1 text-sm italic w-full text-end text-red-800">*required</p>
                            </div>
                            <div>
                                <select name={"type"} id={"type"} onChange={handleChange} onClick={handleChange} className={"mb-2 text-left border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 bg-gray-700 border-gray-600 dark:placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"} required>
                                    {error ? <option className={"hidden"} value={""}>Error loading device types</option> : <>
                                        <option className={"hidden"} value={""}>Select a type</option>
                                        {deviceTypes?.map((deviceType) => (
                                            <option key={deviceType.name} value={deviceType.name}>{deviceType.name}</option>
                                        ))}
                                        <option value={"new"} className={"p-4"}>New type</option>
                                    </>}
                                </select>
                                <p className="mt-1 text-sm italic w-full text-end text-red-800">*required</p>
                                {selectedNew ? addType : <></>}
                            </div>
                            <div>
                                <label htmlFor="description"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                <input type="description" name="description" id="description" placeholder=""
                                       className="bg-gray-50 border border-orange-900 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-400 dark:focus:border-orange-900"
                                       onChange={handleChange}/>
                            </div>
                            {error ? <div className={"text-red-500 w-full text-center"}>{error}</div> : <></>}
                            <button type="submit"
                                    className="w-full text-white bg-primary-600 hover:bg-primary-700 hover:ring-4 hover:outline-none hover:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    } else {
        return redirect("/profile/login")
    }
}

export default CreateDevicePage;
