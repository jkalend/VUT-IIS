import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server";
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"


// GET - get all device with deviceId
export const GET = async (request: NextRequest, { params }) => {
    const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1))) {
        try {
            let kpi_status = true;
            const device = await prisma.device.findUnique({
                where: {
                    deviceId: Number(params.deviceId)
                }
            })
            const kpis = await prisma.kpi.findMany({
                where: {
                    value: {
                        deviceId: Number(params.deviceId)
                    }
                }
            })
            if (kpis && kpis.length == 1) {
                /* check value against recent value of device */
                if (kpis[0].relation == "=") { 
                    kpi_status = device?.recentValue == kpis[0].threshold
                }
                else if (kpis[0].relation == ">") {
                    kpi_status = device?.recentValue > kpis[0].threshold
                }
                else if (kpis[0].relation == "<") {
                    kpi_status = device?.recentValue < kpis[0].threshold
                }
                else if (kpis[0].relation == ">=") {
                    kpi_status = device?.recentValue >= kpis[0].threshold
                }
                else if (kpis[0].relation == "<=") {
                    kpi_status = device?.recentValue <= kpis[0].threshold
                }
                else if (kpis[0].relation == "!=") {
                    kpi_status = device?.recentValue != kpis[0].threshold
                }
                if (kpis[0].result == "ERROR") kpi_status = !kpi_status
            }
            return NextResponse.json({"device":device, "kpi_status":kpi_status}, {status: 200});
        }
        catch (err) {
            return NextResponse.json(err, {status: 500});
        }
    }
    else {
        return NextResponse.json("Unauthorized", {status: 400});
    }
}


// PUT - edit device with given deviceId
export const PUT = async (request: NextRequest, { params }) => {
    const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1))) {
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
    else {
        return NextResponse.json("Unauthorized", {status: 400});
    }
}

//DELETE - delete device with given device id
export const DELETE = async (request: NextRequest, { params }) => {
    const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1))) {
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
    else {
        return NextResponse.json("Unauthorized", {status: 400});
    }
}

