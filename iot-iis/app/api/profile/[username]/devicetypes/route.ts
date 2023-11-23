import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"

/* POST- create new device type */
export const POST = async (request: NextRequest, {params}) => {
    const session = await getServerSession(authOptions)
    if (session && session.user?.username == params.username) {
        const { devTypeName } = await request.json();
        try {
            const device_type = await prisma.deviceType.create({
                username: params.username,
                name: devTypeName
            });
            return NextResponse.json(device_type, {status: 200});
        } catch (error) {
            return NextResponse.json("Could not create new device type", {status: 500});
        }
    }
    else {
        return NextResponse.json("Unauthorized", {status: 400});
    }
}

// GET - get all device types from db
export const GET = async (request: NextRequest, {params}) => {
    const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1))) {
        try {
            const device_types = await prisma.deviceType.findMany({
                where: {
                    username: params.username,
                }
            });
            return NextResponse.json(device_types, {status: 200});
        } catch (error) {
            return NextResponse.json("Could not fetch device types from db", {status: 500});
        }
    }
    else {
        return NextResponse.json("Unauthorized", {status: 400});
    }
}