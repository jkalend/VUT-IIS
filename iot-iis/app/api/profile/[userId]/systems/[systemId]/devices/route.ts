import prisma from "@/app/db";
import { NextRequest } from "next/server";

// POST - add device to system
export const POST = async (request: NextRequest, { params }) => {
	const { deviceId } = await request.json();
	try {
		const addedDevice = await prisma.device.update({
			where: {
				deviceId: deviceId,
			},
			data: {
				systemId: params.systemId,
				system: { connect: { systemId: params.systemId } },
			},
		});
		return new Response(JSON.stringify(addedDevice), { status: 200 });
	} catch (err) {
		return new Response("Could not add device to system", { status: 500 });
	}
};

// DELETE device from system - NOT COMPLETELY
export const DELETE = async (request: NextRequest, { params }) => {
	const { deviceId } = await request.json();
	try {
		const deletedDevice = await prisma.device.update({
			where: {
				deviceId: deviceId,
			},
			data: {
				systemId: null,
			},
		});
		return new Response(
			`Successfuly deleted device ${deletedDevice.deviceId}`,
			{ status: 200 }
		);
	} catch (err) {
		return new Response("Could not delete device from system", {
			status: 500,
		});
	}
};
