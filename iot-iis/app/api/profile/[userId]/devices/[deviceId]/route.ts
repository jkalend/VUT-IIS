import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server";


// GET - get all device with deviceId
export const GET = async (request: NextRequest, { params }) => {
    try {
        const device = await prisma.device.findUnique({
            where: {
                deviceId: params.deviceId
            }
        })
        return new Response(JSON.stringify(device), {status: 200});
    }
    catch (err) {
        return new Response("Could not fetch device", {status: 500})
    }
}


// PUT - edit device with given deviceId
export const PUT = async (request: NextRequest, { params }) => {

    // TODO: ake parametre tu chceme??? resp co vsetko sa moze menit
    const {alias, deviceTypeName, description} = await request.json();
    try {

        const device = await prisma.device.findUnique({
            where: {
                deviceId: params.deviceId
            }
        })

        const updatedDevice = await prisma.device.update({
            where: {
                deviceId: params.deviceId
            },
            data: {
                alias: alias !== "" ? alias : (device && device.alias),
                type: deviceTypeName !== "" ? deviceTypeName : (device && device.type),
                deviceType: { connect: { name: deviceTypeName } },
                description: description !== "" ? description : (device && device.description),
            }
        })
        return new Response(JSON.stringify(updatedDevice), {status: 200});

    }
    catch (err) {
        return new Response("Could not edit device", {status: 500})
    }
}

//DELETE - delete device with given user id
export const DELETE = async (request: NextRequest, { params }) => {
    try {
        const deletedDevice = await prisma.device.delete({
            where: {
                deviceId: params.deviceId
            }
        })
        return new Response(`Successfully deleted device ${deletedDevice.deviceId}`, {status: 200});
    }
    catch (err) {
        return new Response("Could not fetch device", {status: 500})
    }
}