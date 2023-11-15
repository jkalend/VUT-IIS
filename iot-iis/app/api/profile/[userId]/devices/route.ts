import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server";


// GET - get all devices with given userId
export const GET = async (request: NextRequest, { params }) => {
    try {
        const devices = await prisma.device.findMany({
            where: {
                userId: params.userId
            }
        })
        return new Response(JSON.stringify(devices), {status: 200});
    }
    catch (err) {
        return new Response("Could not fetch devices", {status: 500})
    }
}


// POST - create new device for given userId 
export const POST = async (request: NextRequest, { params }) => {

    const {alias, deviceTypeName, description} = await request.json();
    try {

        const device = await prisma.device.create({
        data: {
            alias: alias,
            type: { connect: { name: deviceTypeName } },
           // systemId: systemId,
            description: description,
            userId: { 
                connect: { userId: params.userId } 
            },
            brokerId: { 
                connect: { userId: 1} 
            },
            /// systemId: systemId !== undefined ? systemId : null, ----- toto bude vzdy null podla mna ked vytvaras device
        }
        })
        return new Response(JSON.stringify(device), {status: 200});

    }
    catch (err) {
        return new Response("Could not create new device", {status: 500})
    }
}
