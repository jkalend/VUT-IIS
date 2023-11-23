import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"

/* POST- create new parameter for deviceType with deviceTypeName */
export const POST = async (request: NextRequest, {params}) => {
    const session = await getServerSession(authOptions)
    if (session && session.user?.username == params.username) {
        const { parameterName, valuesFrom, valuesTo, precision } = await request.json();
        try {
            // TODO: create new parameter for device type with params.deviceTypeName
            const parameter = 'query here'

            return NextResponse.json(parameter, {status: 200});
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
            // TODO: fetch all parameters for params.deviceTypeName
            const parameters = 'query here'
            
            return NextResponse.json(parameters, {status: 200});
        } catch (error) {
            return NextResponse.json("Could not fetch parameters for device type", {status: 500});
        }
    }
    else {
        return NextResponse.json("Unauthorized", {status: 400});
    }
}