import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

// GET - all systems with given userId
export const GET = async (request: NextRequest, { params }) => {
	try {
		const allSystems = await prisma.system.findMany({
			where: {
				userId: Number(params.userId),
			},
			include: {
				devices: true,
			}
		});
		return NextResponse.json(allSystems, { status: 200 });
	} catch (err) {
		return NextResponse.json("Could not fetch devices", { status: 500 });
	}
};

// POST - create new system in db
export const POST = async (request: NextRequest, { params }) => {
	const { name, description } = await request.json();
	try {
		const system = await prisma.system.create({
			data: {
				userId: Number(params.userId),
				name: name,
				description: description,
			},
		});
		return NextResponse.json(system, { status: 200 });
	} catch (err) {
		return NextResponse.json("Could not create new system", { status: 500 });
	}
};
