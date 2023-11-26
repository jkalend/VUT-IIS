import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server";
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"

function validate_kpi (recentValue: Number, threshold: Number, relation: String, result: String) {
    let kpi_status = false
    if (relation == "=") { 
        kpi_status = recentValue == threshold
    }
    else if (relation == ">") {
        kpi_status = recentValue > threshold
    }
    else if (relation == "<") {
        kpi_status = recentValue < threshold
    }
    else if (relation == ">=") {
        kpi_status = recentValue >= threshold
    }
    else if (relation == "<=") {
        kpi_status = recentValue <= threshold
    }
    else if (relation == "!=") {
        kpi_status = recentValue != threshold
    }
    if (result == "ERROR") kpi_status = !kpi_status
    return kpi_status
}

// GET - get all device with deviceId
export const GET = async (request: NextRequest, { params }) => {
    const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
        try {
            let kpi_status = true;
            const device = await prisma.device.findUnique({
                where: {
                    deviceId: Number(params.deviceId)
                },
            })

            const kpis = await prisma.kpi.findMany({
                where: {
                    value: {
                        deviceId: Number(params.deviceId)
                    }
                }
            })
            if (kpis) {
                /* check value against recent value of device */

                // TODO: find recent value of kpi.valueId
                const recentVal = 0 // query here

                kpis.forEach (function (kpi) {
                    kpi_status &&= validate_kpi (recentVal, kpi.threshold, kpi.relation, kpi.result)
                })
                
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
    if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
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
                    typeId: deviceTypeId,
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
    if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
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

// POST - create new KPI for device
export const POST = async (request: NextRequest, { params }) => {
    const session = await getServerSession(authOptions)
    if (session && session.user?.username == params.username) {
        const { relation, threshold, result } = await request.json();
        try {
            const value = await prisma.value.findFirst({
                where: {
                    deviceId: params.deviceId,
                    parameter: {
                        name: parameterName
                    }
                },
                select: {
                    valueId: true
                }
            });
            const kpi = await prisma.kpi.create({
                data: {
                    valueId: value.valueId,
                    relation: relation,
                    threshold: threshold,
                    result: result,
                },
            });
            return NextResponse.json(kpi, { status: 200 });
        } catch (err) {
            return NextResponse.json("Could not add KPI to system", { status: 500 });
        }
    }
    else {
        return NextResponse.json("Unauthorized", {status: 400});
    }
}