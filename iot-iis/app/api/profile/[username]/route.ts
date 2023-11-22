import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"


export const GET = async (request: NextRequest, {params}) => {
    
    try {
        const devices = await prisma.device.findMany({
            where: {
                username: params.username
            }
        });
        const systems = await prisma.system.findMany({
            where: {
                username: params.username
            }
        });
        return NextResponse.json({"devices": devices.length, "systems":systems.length}, {status: 200});
    } catch (error) {
        console.log("err: ", error)
        return NextResponse.json(error, {status: 500});
    }
}