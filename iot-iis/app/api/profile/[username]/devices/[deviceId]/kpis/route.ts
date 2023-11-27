// @ts-nocheck
import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"

// GET - get all devices with given userId
export const GET = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
    let has_access = false;
	try {
		//
        let system_id = await prisma.device.findUnique({
            where: {
                deviceId: Number(params.deviceId),
            },
            select: {
                systemId: true
            }
        });
        system_id = system_id.systemId
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

	} catch (err) {
        console.log(err)
		// do nothing
	}
    if (session && ((session.user?.username == params.username) || (session.is_admin == 1) || has_access)) {
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
                            parameter: {
                                select: {
                                    parameterId: true,
                                    name: true,
                                }
                            }
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