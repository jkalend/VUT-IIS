/*
PUT - edit given name or description



DELETE - delete system from db



*/

import prisma from "@/app/db";
import {NextRequest, NextResponse} from "next/server";

// PUT - change system info
export const PUT = async (request: NextRequest, { params }) => {
	const { sysName, description } = await request.json();
	try {
		const system = await prisma.system.findUnique({
			where: {
				systemId: Number(params.systemId),
			},
		});

		const updatedSystem = await prisma.system.update({
			where: {
				systemId: Number(params.systemId),
			},
			data: {
				name: sysName !== "" ? sysName : system?.name,
				description:
					description !== "" ? description : system?.description,
			},
		});
		return NextResponse.json(updatedSystem, { status: 200 });
	} catch (err) {
		return NextResponse.json("Could not update system info", { status: 500 });
	}
};

// DELETE system from db
export const DELETE = async (request: NextRequest, { params }) => {
	try {
		const deletedSystem = await prisma.system.delete({
			where: {
				systemId: Number(params.systemId),
			},
		});
		return NextResponse.json(
			`Successfuly deleted device ${deletedSystem.systemId}`,
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json("Could not delete system", { status: 500 });
	}
};

// POST - create new KPI for system
export const POST = async (request: NextRequest, { params }) => {
	const { deviceId, relation, threshold, result } = await request.json();
	try {
		const kpi = null; // TODO add query
		const newKpi = await prisma.kpi.create({
			data: {
				deviceId: Number(deviceId),
				relation: relation,
				threshold: threshold,
				result: result,
			},
		});
		return NextResponse.json(newKpi, { status: 200 });
	} catch (err) {
		return NextResponse.json("Could not add KPI to system", { status: 500 });
	}
};
