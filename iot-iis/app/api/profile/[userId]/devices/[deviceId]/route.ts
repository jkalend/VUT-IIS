import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server";


// GET - get all device with deviceId
export const GET = async (request: NextRequest, { params }) => {
    try {
        const device = await prisma.device.findUnique({
            where: {
                deviceId: Number(params.deviceId)
            }
        })
        return NextResponse.json(device, {status: 200});
    }
    catch (err) {
        return NextResponse.json(err, {status: 500});
    }
}


// PUT - edit device with given deviceId
export const PUT = async (request: NextRequest, { params }) => {

    // TODO: ake parametre tu chceme??? resp co vsetko sa moze menit
    const {alias, deviceTypeName, description} = await request.json();
    try {

        const device = await prisma.device.findUnique({
            where: {
                deviceId: Number(params.deviceId)
            }
        })

        const updatedDevice = await prisma.device.update({
            where: {
                deviceId: Number(params.deviceId)
            },
            data: {
                alias: alias !== "" ? alias : (device && device.alias),
                typus: deviceTypeName !== "" ? deviceTypeName : (device && device.typus),
                // deviceType: { connect: { name: deviceTypeName } },
                description: description !== "" ? description : (device && device.description),
            }
        })
        return NextResponse.json(updatedDevice, {status: 200});
    }
    catch (err) {
        return NextResponse.json(err, {status: 500});
    }
}

//DELETE - delete device with given user id
export const DELETE = async (request: NextRequest, { params }) => {
    try {
        const deletedDevice = await prisma.device.delete({
            where: {
                deviceId: Number(params.deviceId)
            }
        })
        return NextResponse.json(JSON.stringify(`Successfully deleted device ${deletedDevice.deviceId}`), {status: 200});
    }
    catch (err) {
        return NextResponse.json(JSON.stringify("Could not fetch device"), {status: 500})
    }
}