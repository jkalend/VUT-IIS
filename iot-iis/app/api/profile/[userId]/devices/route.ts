import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

// GET - get all devices with given userId
export const GET = async (request: NextRequest, { params }) => {
	try {
		// const devices = await prisma.device.findMany({
		// 	where: {
		// 		userId: Number(params.userId),
		// 	},
		// });
		const user = await prisma.user.findUnique({
			where: {
				userId: Number(params.userId),
			},
		}).devices();
		// console.log("devices: ", user)
		return NextResponse.json(user, { status: 200 });
	} catch (err) {
		console.log("err: ", err)
		return NextResponse.json(err, { status: 500 });
	}
};

// POST - create new device for given userId
export const POST = async (request: NextRequest, { params }) => {
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
				userId: Number(params.userId),
				/// systemId: systemId !== undefined ? systemId : null, ----- toto bude vzdy null podla mna ked vytvaras device
			},
		});
		// console.log("device: ", device)
		// console.log("user: ", user)
		return NextResponse.json(device, { status: 200 });
	} catch (err) {
		console.log("err: ", err)
		return NextResponse.json(err, { status: 500 });
	}
};
