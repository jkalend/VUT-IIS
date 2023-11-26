import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"
import { DeviceTypeWhereUniqueInput } from '@/app/db' // Import the DeviceTypeWhereUniqueInput type

/* POST- create new parameter for deviceType with deviceTypeName */
export const POST = async (request: NextRequest, {params}) => {
    const session = await getServerSession(authOptions)
    if (session && session.user?.username == params.username) {
        const { parameterName, valuesFrom, valuesTo, precision } = await request.json();
        try {
            // create new parameter for device type with params.deviceTypeName

            // @ts-ignore
            const parameter = await prisma.parameter.create({
                data: {
                    typeId: params.deviceTypeId,
                    name: parameterName,
                    valuesFrom: Number(valuesFrom),
                    valuesTo: Number(valuesTo),
                    precision: Number(precision),
                    deviceTypes: { connect: { typeName: params.deviceTypeName } as DeviceTypeWhereUniqueInput }, // Replace 'typeName' with the actual field name for device type name
                },
            });

            return NextResponse.json(parameter, { status: 200 });
        } catch (error) {
            return NextResponse.json("Could not create new parameter", {status: 500});
        }
    }
    else {
        return NextResponse.json("Unauthorized", {status: 400});
    }
}

/* GET - get all parameters for deviceType */
export const GET = async (request: NextRequest, {params}) => {
    const session = await getServerSession(authOptions)
    if (session && session.user?.username == params.username) {
        try {
            //fetch all parameters for params.deviceTypeName
            const parameters = await prisma.parameter.findMany({
                where: {
                    typeId: Number(params.deviceTypeId)
                }
            })
            const typeName = await prisma.deviceType.findMany({
                where: {
                    typeId: Number(params.deviceTypeId)
                },
                select: {
                    name: true
                }
            })
            return NextResponse.json({"parameters":parameters, "typeName":typeName}, {status: 200});
        } catch (error) {
            console.log(error)
            return NextResponse.json("Could not fetch parameters for device type", {status: 500});
        }
    }
    else {
        return NextResponse.json("Unauthorized", {status: 400});
    }
}