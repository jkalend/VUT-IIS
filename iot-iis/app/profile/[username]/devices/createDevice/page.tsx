"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {useEffect, useState} from "react";
// import {useRouter} from "next/router";

const CreateDevicePage = ({params} : {params: any}) => {
    const router = useRouter();
    const { data: session, status } = useSession()
    const [alias, setAlias] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');

    const addDevice = async (e : any) => {
        e.preventDefault();
        if (!session) return;
        // @ts-ignore
        const res = await fetch(`/api/profile/${session.user?.username}/devices`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                alias: alias,
                deviceTypeName: type,
                description: description,
            }),
        });
        //if (!res.ok) throw new Error("Failed to fetch devices");
        const data = await res.json();
        console.log(data);
        // @ts-ignore
        router.push(`/profile/${session.user?.username}/devices/`);
    }

    const handleAlias = (event: any) => {
        setAlias(event.target.value);

        //console.log('value is:', event.target.value);
    };

    const handleType = (event: any) => {
        setType(event.target.value);

        //console.log('value is:', event.target.value);
    };

    const handleDescription = (event: any) => {
        setDescription(event.target.value);

        //console.log('value is:', event.target.value);
    };

    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen mx-auto md:h-screen lg:py-0 mr-64">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl dark:text-white">
                        Create a new device
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={addDevice}>
                        <div>
                            <label htmlFor="alias" className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Device Alias</label>
                            <input type="alias" name="alias" id="alias" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="My Little Device" onChange={handleAlias} required/>
                        </div>
                        <div>
                            <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Device type</label>
                            <input type="type" name="type" id="type" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="thermometer" onChange={handleType} required/>
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <input type="description" name="description" id="description" placeholder="" className="bg-gray-50 border border-orange-900 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-400 dark:focus:border-orange-900" onChange={handleDescription}/>
                        </div>
                        <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateDevicePage;
