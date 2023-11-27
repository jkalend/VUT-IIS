// @ts-nocheck
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
    let has_access = false;
	try {
		//
        const system_id = await prisma.device.findUnique({
			where: {
				deviceId: Number(params.deviceId),
			},
			include: {
				systemId: true
			}
		});
        if (!system_id) throw new Error ("Device does not belong to a system")

		const system = await prisma.system.findUnique({
			where: {
				systemId: Number(system_id),
			},
			include: {
				allowed_users: true
			}
		});
		const users = system.allowed_users;
		if (users.filter((user) => user.username == session.user?.username).length > 0)
			has_access = true;

        console.log(has_access)

	} catch (err) {
        console.log(err)
		// do nothing
	}
    if (session && ((session.user?.username == params.username) || (session.is_admin == 1) || has_access)) {
        try {
            let kpi_status = true;
            const device = await prisma.device.findUnique({
                where: {
                    deviceId: Number(params.deviceId)
                },
                include: {
                    deviceType: true
                }
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
        const {alias, type, description} = await request.json();
        try {

            const device = await prisma.device.findUnique({
                where: {
                    deviceId: Number(params.deviceId)
                }
            })

            const devices = await prisma.device.findMany({
                where: {
                    username: params.username,
                }
            })

            const aliasExists = devices.some(device => device.alias === alias);

            if (aliasExists) {
                return NextResponse.json("Alias already exists", {status: 400});
            }
            const updatedDevice = await prisma.device.update({
                where: {
                    deviceId: Number(params.deviceId)
                },
                data: {
                    alias: alias !== "" ? alias : (device && device.alias),
                    typeId: Number(type),
                    description: description !== "" ? description : (device && device.description),
                }
            });

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
            console.log(err);
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
        const { relation, threshold, result, parameterId } = await request.json();
        try {
            const value = await prisma.value.findFirst({
                where: {
                    deviceId: Number(params.deviceId),
                    parameter: {
                        parameterId: Number(parameterId)
                    },
                },
                select: {
                    valueId: true
                }
            });
            const kpi = await prisma.kpi.create({
                data: {
                    valueId: value.valueId,
                    relation: relation,
                    threshold: Number(threshold),
                    result: result,
                },
            });
            return NextResponse.json(kpi, { status: 200 });
        } catch (err) {
            console.log(err);
            return NextResponse.json("Could not add KPI to system", { status: 500 });
        }
    }
    else {
        return NextResponse.json("Unauthorized", {status: 400});
    }
}