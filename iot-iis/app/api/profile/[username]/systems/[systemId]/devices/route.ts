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
			console.log("err: ", err)
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
    if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1))) {
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
    if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1))) {
		try {
			const devices = await prisma.system.findUnique({
				where: {
					systemId: Number(params.systemId),
				},
			}).devices();
			// console.log("devices: ", user)
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
