// @ts-nocheck
"use client";
import {useRouter, useParams, redirect} from "next/navigation";
import { useSession } from "next-auth/react";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";

const DeviceDetailsPage = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession()
    const [system, setSystem] = useState({} as any);
    const [formValues, setFormValues] = useState({
        sysName: "",
        description: "",
    });
    const [error, setError] = useState('');

    const getSystem = async () => {
        if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
            const res = await fetch(`/api/profile/${params.username}/systems/${params.systemId}`, {
                method: "Get",
                headers: {"Content-Type": "application/json"},
            });
            if (!res.ok) {
                setError("Error loading system");
                return;
            }
            const data = await res.json();
            return data;
        }
    }

    const editSystem = async (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
            const res = await fetch(`/api/profile/${params.username}/systems/${params.systemId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formValues),
            });
            if (!res.ok) {
                setError("Error editing system");
                return;
            }
            router.push(`/profile/${params.username}/systems/${params.systemId}`);
        }
    }

    const deleteSystem = async (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
            const res = await fetch(`/api/profile/${params.username}/system/${params.systemId}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
            });
            if (!res.ok) {
                setError("Error deleting system");
                return;
            }
            router.push(`/profile/${params.username}/systems/`);
        }
    }

    useEffect(() => {
        if (status === "authenticated") {
            getSystem().then(r => {
                setSystem(r);
            });
        } else if (status === "unauthenticated") {
            router.push("/profile/login");
        }
    }, [status, router, getSystem])

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>

    if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
        return (
            <div
                className="flex flex-col items-center justify-center h-screen w-screen mx-auto md:h-screen lg:py-0 mr-64">
                <div
                    className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <div className={"flex flex-row gap-2 w-full justify-between"}>
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl dark:text-white">
                                Edit system
                            </h1>
                        </div>
                        <form className="space-y-4 md:space-y-6" onSubmit={editSystem}>
                            <div>
                                <label htmlFor="sysName"
                                       className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Device
                                    Alias</label>
                                <input name="sysName" id="sysName"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder={system.name} onChange={handleChange}/>
                            </div>
                            <div>
                                <label htmlFor="description"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                <input name="description" id="description" placeholder={system.description}
                                       className="bg-gray-50 border border-orange-900 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-400 dark:focus:border-orange-900"
                                       onChange={handleChange}/>
                            </div>
                            {error && <div className={"text-red-500"}>{error}</div>}
                            <button type={"submit"}
                                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Edit
                            </button>
                            <button type={"button"} onClick={deleteSystem}
                                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Delete
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    } else {
        redirect("/profile/login")
    }
}

export default DeviceDetailsPage;
