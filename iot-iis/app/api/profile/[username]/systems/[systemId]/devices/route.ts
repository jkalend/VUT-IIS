// @ts-nocheck
import prisma from "@/app/db";
import {NextRequest, NextResponse} from "next/server";
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"

// POST - add device to system
export const POST = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
    if (session && (session.user?.username == params.username)) {
		const { deviceId } = await request.json();
		try {
			const addedDevice = await prisma.device.update({
				where: {
					deviceId: Number(deviceId),
				},
				data: {
					//systemId: Number(params.systemId),
					system: { connect: { systemId: Number(params.systemId) } },
				},
			});
			return NextResponse.json(addedDevice, { status: 200 });
		} catch (err) {
			console.log(err)
			return NextResponse.json("Could not add device to system", { status: 500 });
		}
	}
	else {
		return NextResponse.json("Unauthorized", {status: 400});
	}

};

// DELETE device from system - NOT COMPLETELY
export const DELETE = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
		const { deviceId } = await request.json();
		try {
			const deletedDevice = await prisma.device.update({
				where: {
					deviceId: Number(deviceId),
				},
				data: {
					//systemId: null,
					system: { disconnect: { systemId: Number(params.systemId) } },
				},
			});
			return NextResponse.json(
				`Successfuly deleted device ${deletedDevice.deviceId} from system`,
				{ status: 200 }
			);
		} catch (err) {
			console.log(err)
			return NextResponse.json("Could not delete device from system", {status: 500});
		}
	}
	else {
		return NextResponse.json("Unauthorized", {status: 400});
	}
};


// GET - get all devices in the system
export const GET = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
	let has_access = false;
	try {
		//
		const system = await prisma.system.findUnique({
			where: {
				systemId: Number(params.systemId),
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
	if (session && ((session.user?.username == params.username) || (session.is_admin == 1) || (has_access))) {
		try {
			const devices = await prisma.system.findUnique({
				where: {
					systemId: Number(params.systemId),
				},
				select: {
					devices: {
						select: {
							deviceId: true,
							alias: true,
							description: true,
							values: {
								select: {
									valueId: true,
									recentValue: true,
									parameter: {
										select: {
											unit: true,
										}
									}
								}
							},
							typeId: true,
							deviceType: true,
							systemId: true,
						},
					}
				},
			});
			return NextResponse.json(devices?.devices, { status: 200 });
		} catch (err) {
			console.log(err)
			return NextResponse.json(err, { status: 500 });
		}
	}
	else {
		return NextResponse.json("Unauthorized", {status: 400});
	}
};
