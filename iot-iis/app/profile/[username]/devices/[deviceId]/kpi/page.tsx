"use client";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {ChangeEvent, FormEvent,  useState} from "react";
import Link from "next/link";

const KpiPage = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession()
    const [formValues, setFormValues] = useState({
        threshold: "",
    });

    const createKPI = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!session) return;
        // @ts-ignore
        const formData = new FormData(e.currentTarget)
        const res = await fetch(`/api/profile/${session.user?.username}/devices/${params.deviceId}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                result: formData.get("result"),
                relation: formData.get("relation"),
                threshold: formData.get("threshold")
            }),
        });
        //if (!res.ok) throw new Error("Failed to fetch devices");
        const data = await res.json();
        // console.log(data);
        router.back();
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    if (status === "loading")
        return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen md:h-screen lg:py-0 mr-64">
            <div className="min-w-[55%] rounded-lg shadow dark:border md:mt-0 sm:max-w-md bg-gray-800 border-gray-700">
                <div className="space-y-4 md:space-y-6 sm:p-8 min-w-screen">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl dark:text-white w-full">
                        Add a new KPI
                    </h1>
                    <form id={"kpi"} className="flex grid-cols-3 grid-rows-1 justify-center items-center gap-2" onSubmit={createKPI}>
                        <div className={"w-1/3"}>
                            <select name={"relation"} id={"relation"} className={"flex flex-grow min-w-0 text-left border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 bg-gray-700 border-gray-600 dark:placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"}>
                                <option value={"ok"} className={"max-w-full"}>OK</option>
                                <option value={"err"}>ERROR</option>
                            </select>
                        </div>
                        <h2>when </h2>
                        <h2>value </h2>
                        <div>
                            <select name={"relation"} id={"relation"} className={"text-left border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 bg-gray-700 border-gray-600 dark:placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"}>
                                <option value={'>'}>{'>'}</option>
                                <option value={'<'}>{'<'}</option>
                                <option value={'='}>{'='}</option>
                                <option value={'!='}>{'!='}</option>
                                <option value={'>='}>{'>='}</option>
                                <option value={'<='}>{'<='}</option>
                            </select>
                        </div>
                        <div>
                            <input type="threshold" name="threshold" id="threshold" placeholder={"threshold"} className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 bg-gray-700 border-gray-600 dark:placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" onChange={handleChange}/>
                        </div>
                    </form>
                    <button type="submit" form={"kpi"} className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Accept</button>
                </div>
            </div>
        </div>
    );
}

export default KpiPage;
