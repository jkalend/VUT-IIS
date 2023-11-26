import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"

// GET - get all devices with given userId
export const GET = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
		try {
			const kpis = await prisma.kpi.findMany({
				where: {
					value: {
                        device: {
                            deviceId: Number(params.deviceId)
                        }
                    },
				},
                select: {
                    kpiId: true,
                    relation: true,
                    threshold: true,
                    result: true,
                    value: {
                        select: {
                            recentValue: true,
                        }
                    }
                }
            });

			return NextResponse.json(kpis, { status: 200 });
		} catch (err) {
			return NextResponse.json(err, { status: 500 });
		}
	}
	else {
		return NextResponse.json("Unauthorized", {status: 400});
	}
};