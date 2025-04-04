// @ts-nocheck
import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"

/* POST- create new device type */
export const POST = async (request: NextRequest, {params}) => {
    const session = await getServerSession(authOptions)
    if (session && session.user?.username === params.username) {
        const { devTypeName } = await request.json();
        try {
            
            const deviceTypes = await prisma.deviceType.findMany({
                where: {
                    username: params.username,
                }
            })

            const nameExists = deviceTypes.some(deviceType => deviceType.name === devTypeName);

            if (nameExists) {
                return NextResponse.json("Type name already exists", {status: 400});
            }

            const device_type = await prisma.deviceType.create({
                data: {
                    user: { connect: { username: params.username } },
                    name: devTypeName
                }
            });
            return NextResponse.json(device_type, {status: 200});
        } catch (error) {
            console.log(error);
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
    if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
        try {
            const device_types = await prisma.deviceType.findMany({
                where: {
                    username: params.username,
                },
                include:{
                    parameters: {
                        select: {
                            name: true,
                            unit: true,
                            parameterId: true,
                            valuesFrom: true,
                            valuesTo: true,
                        }
                    }
                }
            });
            return NextResponse.json(device_types, {status: 200});
        } catch (error) {
            console.log(error);
            return NextResponse.json("Could not fetch device types from db", {status: 500});
        }
    }
    else {
        return NextResponse.json("Unauthorized", {status: 400});
    }
}