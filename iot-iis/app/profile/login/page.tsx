// @ts-nocheck
"use client"
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import {signIn, useSession} from "next-auth/react";
import {redirect, useRouter} from "next/navigation";
export default function Login() {
    const {data: session, status} = useSession()
    const router = useRouter();
    const [formValues, setFormValues] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // await new Promise(r => setTimeout(r, 2000));
        try {
            const res = await signIn("credentials", {
                redirect: false,
                username: formValues.username,
                password: formValues.password,
            });
            if (res?.error) {
                setError(true);
                setFormValues({ ...formValues, password: "" })
            } else {
                setError(false);
                //router.push("/")
            }
        } catch (err) {
            //console.log(err);
        }
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setError(false)
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };
        if (status === "loading") return <></>
        if (status === "authenticated") return redirect("/")

    return (
            <div className="flex flex-col items-center justify-center h-screen w-screen mx-auto md:h-screen lg:py-0 mr-64">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your username</label>
                                <input onChange={handleChange} type="username" name="username" id="username" maxLength={40} value={formValues.username} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Visitor" required/>
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input onChange={handleChange} type="password" name="password" id="password" maxLength={40} placeholder="••••••••" value={formValues.password} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                            </div>
                            {error ? (
                                <h1 className={"text-base text-red-800 flex flex-col text-center w-full"}>Wrong username or password</h1>
                            ) : (
                                <></>
                            )}
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet? <Link href="../profile/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
    )
}