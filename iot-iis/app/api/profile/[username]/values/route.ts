// @ts-nocheck
import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"

/* POST- create new value */
export const POST = async (request: NextRequest, {params}) => {
    const session = await getServerSession(authOptions)
    if (session && session.user?.username === params.username) {
        const { parameterId, deviceId } = await request.json();
        try {
            console.log ("paramId", parameterId)
            console.log ("deviceId", parameterId)
            const value = await prisma.value.create({
                data: {
                    parameterId: parameterId,
                    deviceId: deviceId
                }
            });
            return NextResponse.json(value, {status: 200});
        } catch (error) {
            return NextResponse.json("Could not create new value", {status: 500});
        }
    }
    else {
        return NextResponse.json("Unauthorized", {status: 400});
    }
}