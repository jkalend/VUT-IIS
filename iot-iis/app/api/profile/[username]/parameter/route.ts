import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"

export const POST = async (request: NextRequest, {params}) => {
    const { name, values_from, values_to, precision } = await request.json();
    try {
        const parameter = await prisma.parameter.create({
            name: name,
            values_from: values_from,
            values_to: values_to,
            precision: precision
        });
        return NextResponse.json(parameter, {status: 200});
    } catch (error) {
        return NextResponse.json("Could not create new parameter", {status: 500});
    }
}

export const GET = async (request: NextRequest, {params}) => {
    try {
        const device_types = await prisma.deviceType.findMany({
            where: {
                username: params.username
            }
        });
        return NextResponse.json(device_types, {status: 200});
    } catch (error) {
        return NextResponse.json("Could not fetch device types from db", {status: 500});
    }
}