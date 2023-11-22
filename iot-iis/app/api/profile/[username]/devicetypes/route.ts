import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"

export const POST = async (request: NextRequest, {params}) => {
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

export const GET = async (request: NextRequest, {params}) => {
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