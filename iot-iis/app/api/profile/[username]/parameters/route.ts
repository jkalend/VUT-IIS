import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"

/* POST- create new parameter */
export const POST = async (request: NextRequest, {params}) => {
    const session = await getServerSession(authOptions)
    if (session && session.user?.username === params.username) {
        const { paramName, valuesFrom, valuesTo, precision, deviceTypeId, unit } = await request.json();
        try {
            const parameter = await prisma.parameter.create({
                data: {
                    name: paramName,
                    valuesFrom: valuesFrom,
                    valuesTo: valuesTo,
                    precision: precision,
                    deviceTypes: deviceTypeId,
                    unit: unit,
                }
            });
            return NextResponse.json(parameter, {status: 200});
        } catch (error) {
            return NextResponse.json("Could not create new parameter", {status: 500});
        }
    }
    else {
        return NextResponse.json("Unauthorized", {status: 400});
    }
}