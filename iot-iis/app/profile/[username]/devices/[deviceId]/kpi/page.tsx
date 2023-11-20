"use client"
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";

const kpiPage = () => {
    const createKPI = async (e: any) => {
        e.preventDefault()
        if (!session) return;
        // @ts-ignore
        const res = await fetch(`/api/profile/${session.user?.userId}/systems/${params.systemId}/kpi`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(kpi),
        });
        //if (!res.ok) throw new Error("Failed to fetch devices");
        const data = await res.json();
        console.log(data);
        router.push(`/profile/${session.user?.username}/systems/${params.systemId}`);
    }

    return (
        <></>
    )
}

export default kpiPage;