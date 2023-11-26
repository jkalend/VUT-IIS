"use client"
import React, {ChangeEvent, useEffect, useState} from 'react'
import {useSession} from 'next-auth/react'
import {redirect, useParams, useRouter} from 'next/navigation'
import { signOut } from "next-auth/react"

const ProfileEdit = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession()
    const [error, setError] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [formValues, setFormValues] = useState({
        old_pwd: "",
        new_pwd: "",
    });

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
            const res = await fetch(`/api/profile/${params.username}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formValues),
            });
            if (!res.ok) {
                setError(true);
                setFormValues({old_pwd: "", new_pwd: ""})
            }
            if (session?.is_admin == 0) {
                await signOut({callbackUrl: "/"})
            } else {
                router.push("/profile/admin/manage")
            }
        }
    }

    const deleteAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
            const res = await fetch(`/api/profile/${params.username}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
            });
            if (!res.ok) {
                setDeleteError(true);
                setFormValues({old_pwd: "", new_pwd: ""})
            }
            if (session.is_admin == 0) {
                await signOut({callbackUrl: "/"})
            } else {
                router.push("/profile/admin/manage")
            }
        }
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
        setError(false)
    };

    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>

    if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-screen mx-auto md:h-screen lg:py-0 mr-64">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Edit your profile
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
                            <div>
                                <label htmlFor="old_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Old Password</label>
                                <input onChange={handleChange} type="password" name="old_password" id="old_password" value={formValues.old_pwd} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                <h1 className={"text-base text-red-800"}>{error ? "Wrong password" : ""}</h1>
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                                <input onChange={handleChange} type="password" name="password" id="password" value={formValues.new_pwd}  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            </div>
                            <div className="flex flex-row items-center justify-between">
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Save</button>
                            </div>
                            <button onClick={deleteAccount} className="text-xs w-full text-red-900 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                Delete account
                            </button>
                            {deleteError ? <h1 className={"text-base text-red-800"}>Error while deleting account</h1> : <></>}
                        </form>
                    </div>
                </div>
            </div>
        )
    } else {
        return redirect("/profile/login")
    }

}

export default ProfileEdit