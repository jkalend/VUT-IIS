"use client";

import {useState} from 'react';
import {redirect, useRouter} from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react"

export default function Register() {

    let router = useRouter();
    const {data: session, status} = useSession()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const sendForm = async(e:any) => {
        e.preventDefault();
        try {
            const res = await fetch(
                "/api/profile/register",
                {
                    method: "POST",
                    body: JSON.stringify({
                        username: username,
                        password: password,
                    }),
                }
            )
            if (!res.ok) {
                setError("Failed to sign in")
            }
            const user  = await res.json();
            try {
                const _ = await signIn("credentials", {
                    redirect: true,
                    username: user.username,
                    password: user.password,
                    callbackUrl:`/profile/${user.username}`
                });
            } catch (err) {
                setError("Failed to sign in")
            }
        }
        catch (error : any) {
            setError(error.message)
        }
    }

    const handleUsername = (event: any) => {
        setUsername(event.target.value);
    };

    const handlePassword = (event: any) => {
        setPassword(event.target.value);
    };

    if (status === "loading") return <></>
    if (status === "authenticated") return redirect("/")

    return(
        <div className="flex flex-col items-center justify-center h-screen w-screen mx-auto md:h-screen lg:py-0 mr-64">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl dark:text-white">
                            Create a new account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={sendForm}>
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Your username</label>
                                <input type="username" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" onChange={handleUsername} required/>
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-orange-900 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-400 dark:focus:border-orange-900" onChange={handlePassword} required/>
                            </div>
                            {error ? (
                                <h1 className={"text-base text-red-700 flex flex-col text-center w-full"}>{error}</h1>
                            ) : (
                                <></>
                            )}
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign up</button>
                        </form>
                    </div>
                </div>
            </div>
    )
}