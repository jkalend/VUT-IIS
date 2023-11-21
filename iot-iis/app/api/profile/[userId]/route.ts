import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"

export const GET = async (request: NextRequest, response: NextResponse, {params}) => {
    try {
        const devices = await prisma.device.findMany({
            where: {
                userId: Number(params.userId)
            }
        });
        const systems = await prisma.system.findMany({
            where: {
                userId: Number(params.userId)
            }
        });
        return NextResponse.json({"device_size": devices.length, "system_size":systems.length}, {status: 200});
    } catch (error) {
        console.log("err: ", error)
        return NextResponse.json(error, {status: 500});
    }
    
}