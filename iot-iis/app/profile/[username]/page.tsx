"use client"
import React, {ChangeEvent, useEffect, useState} from 'react'
import {signIn, useSession} from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from "next/link";

const UserProfile = ({params}) => {
  const { data: session, status } = useSession()
  const [devices, setDevices] = useState([]);

  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formValues);
    // await new Promise(r => setTimeout(r, 2000));
    // try {
    //   const res = await signIn("credentials", {
    //     redirect: true,
    //     username: formValues.username,
    //     password: formValues.password,
    //     //callbackUrl:`/`
    //   });
    // } catch (err) {
    //   console.log(err);
    // }
  }
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const fetchData = async () => {
    console.log(session);
    // if (!session) return;
    const res = await fetch(`/api/profile/${session.user?.username}/admin`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    //if (!res.ok) throw new Error("Failed to fetch devices");
    const data = await res.json();
    console.log(data);
    // setDevices(data);
    return data;
    //console.log(data);
  }

  useEffect(() => {
    console.log(status);
    if (status === "authenticated")
    fetchData().then(r => {setDevices(r)});
  }, [status])

  if (status === "loading")
    return <div className={"flex h-screen w-screen justify-center items-center"}>Loading...</div>

  if (session && (session.user?.username == params.username)) {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen mx-auto md:h-screen lg:py-0 mr-64">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Edit your profile
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
                <div>
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                  <input onChange={handleChange} type="username" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={session.user?.username}/>
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input onChange={handleChange} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <button className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Delete</button>
                  <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
    )
  }
  else {
    // redirect("/profile/login")
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen mx-auto md:h-screen lg:py-0 mr-64">
          <h1 className={"font-bold text-2xl"}>
            User {params.username} devices
          </h1>
          <div className={"flex flex-col rounded-2xl bg-gray-900 p-2 gap-2 overflow-y-auto mb-16"}>
            {session && devices.map((device: any) => (
                <div key={device.id} className={"flex flex-row justify-between p-5 rounded-2xl bg-gray-700 py-3"}>
                  <div className={"flex flex-col"}>
                    <div className={"font-bold text-xl"}>
                      {device.username}
                    </div>
                    <h1 className={"text-gray-500"}>
                      {device.userId}
                    </h1>
                  </div>
                  <div className={"flex flex-col"}>
                    <h1 className={"font-bold text-xl"}>
                      {device.password}
                    </h1>
                  </div>
                </div>
            ), [])}
          </div>
        </div>
    )
  }
  
}

export default UserProfile