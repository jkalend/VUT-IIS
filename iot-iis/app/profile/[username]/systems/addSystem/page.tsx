"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {ChangeEvent, useState} from "react";

const CreateSystemPage = ({params} : {params: any}) => {
    const router = useRouter();
    const { data: session, status } = useSession()
    const [formValues, setFormValues] = useState({
        name: "",
        description: "",
    });

    const addSystem = async (e : any) => {
        e.preventDefault();
        if (!session) return;
        // @ts-ignore
        const res = await fetch(`/api/profile/${session.user?.userId}/systems`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: formValues.name,
                description: formValues.description,
            }),
        });
        //if (!res.ok) throw new Error("Failed to fetch devices");
        const data = await res.json();
        console.log(data);
        // @ts-ignore
        router.push(`/profile/${session.user?.username}/systems/`);
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center text-2xl"}>Loading...</div>

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen mx-auto md:h-screen lg:py-0 mr-64">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl dark:text-white">
                        Create a new system
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={addSystem}>
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">System name</label>
                            <input type="name" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} required/>
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">System description</label>
                            <input type="description" name="description" id="description" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  onChange={handleChange}/>
                        </div>
                        <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateSystemPage;
