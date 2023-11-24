import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server";
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"

// GET - fetch kpi with params.kpiId
export const GET = async (request: NextRequest, { params }) => {
    const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1))) {
        try {
            //fetch KPI for device with params.deviceId
            const kpi = await prisma.kpi.findMany({
                where: {
                    kpiId: Number(params.kpiId)
                }
            })

            return NextResponse.json(kpi, { status: 200 });
        } catch (err) {
            return NextResponse.json("Could not fetch kpi", { status: 500 });
        }
    }
    else {
        return NextResponse.json("Unauthorized", {status: 400});
    }
};

// DELETE - delete kpi for device
export const DELETE = async (request: NextRequest, { params }) => {
    const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1))) {
        try {
            //delete kpi for device with params.deviceId
            const kpiToDelete = await prisma.kpi.findFirst({
                where: {
                    value: {
                        deviceId: Number(params.deviceId),
                        parameterName: String(parameterName)
                    }
                }
            });
            const deletedKpi = await prisma.kpi.delete({
                where: {
                    kpiId: kpiToDelete.kpiId
                }
            });

            return NextResponse.json(deletedKpi, { status: 200 });
        } catch (err) {
            return NextResponse.json("Could not delete kpi from device", { status: 500 });
        }
    }
    else {
        return NextResponse.json("Unauthorized", {status: 400});
    }
};

// PUT - edit KPI for device
export const PUT = async (request: NextRequest, { params }) => {
    const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1))) {
        const { relation, threshold, result } = await request.json();
        try {
            const kpi = 'fetch old kpi - params.kpiId'
            const new_kpi = 'edit old kpi with new values'
            return NextResponse.json(new_kpi, { status: 200 });
        } catch (err) {
            return NextResponse.json("Could change KPI values", { status: 500 });
        }
    }
    else {
        return NextResponse.json("Unauthorized", {status: 400});
    }
};