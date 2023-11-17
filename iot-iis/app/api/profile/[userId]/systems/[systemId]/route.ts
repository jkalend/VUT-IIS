/*
PUT - edit given name or description



DELETE - delete system from db



*/

import prisma from "@/app/db";
import { NextRequest } from "next/server";

// PUT - change system info
export const PUT = async (request: NextRequest, { params }) => {
	const { sysName, description } = await request.json();
	try {
		const system = await prisma.system.findUnique({
			where: {
				systemId: params.systemId,
			},
		});

		const updatedSystem = await prisma.system.update({
			where: {
				systemId: params.systemId,
			},
			data: {
				name: sysName !== "" ? sysName : system?.name,
				description:
					description !== "" ? description : system?.description,
			},
		});
		return new Response(JSON.stringify(updatedSystem), { status: 200 });
	} catch (err) {
		return new Response("Could not update system info", { status: 500 });
	}
};

// DELETE system from db
export const DELETE = async (request: NextRequest, { params }) => {
	try {
		const deletedSystem = await prisma.system.delete({
			where: {
				systemId: params.systemId,
			},
		});
		return new Response(
			`Successfuly deleted device ${deletedSystem.systemId}`,
			{ status: 200 }
		);
	} catch (err) {
		return new Response("Could not delete system", { status: 500 });
	}
};

// POST - create new KPI for system
export const POST = async (request: NextRequest, { params }) => {
	const { deviceId, relation, threshold, result } = await request.json();
	try {
		const kpi = null; // add query
		const newKpi = await prisma.kpi.create({
			data: {
				deviceId: deviceId,
				relation: relation,
				threshold: threshold,
				result: result,
			},
		});
		return new Response(JSON.stringify(kpi), { status: 200 });
	} catch (err) {
		return new Response("Could not add KPI to system", { status: 500 });
	}
};
