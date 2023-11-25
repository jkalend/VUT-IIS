import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"

// GET - get all devices with given userId
export const GET = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1))) {
		try {
			const devices = await prisma.user.findUnique({
				where: {
					username: params.username,
				},
				select: {
					devices: {
						include: {
							values: true,
						},
					}
				},
			}).devices();
			return NextResponse.json(devices, { status: 200 });
		} catch (err) {
			console.log("err: ", err)
			return NextResponse.json(err, { status: 500 });
		}
	}
	else {
		return NextResponse.json("Unauthorized", {status: 400});
	}
};

// POST - create new device for given userId
export const POST = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
    if (session && session.user?.username == params.username) {
		const { alias, deviceTypeName, description } = await request.json();
		try {
			console.log("params: ", params)
			console.log("alias: ", alias)
			console.log("deviceTypeName: ", deviceTypeName)
			console.log("description: ", description)
		
			let device = await prisma.device.create({
				data: {
					alias: alias,
					typus: deviceTypeName,
					// systemId: systemId,
					description: description,
					username: params.username,
					/// systemId: systemId !== undefined ? systemId : null, ----- toto bude vzdy null podla mna ked vytvaras device
				},
			});
			return NextResponse.json(device, { status: 200 });
		} catch (err) {
			console.log("err: ", err)
			return NextResponse.json(err, { status: 500 });
		}
	}
	else {
		return NextResponse.json("Unauthorized", {status: 400});
	}
};
