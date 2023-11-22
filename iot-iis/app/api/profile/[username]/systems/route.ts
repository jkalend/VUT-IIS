import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"

// GET - all systems with given userId
export const GET = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
    if (session && session.user?.username == params.username) {
		try {
			const allSystems = await prisma.system.findMany({
				where: {
					username: params.username,
				},
				include: {
					devices: true,
				}
			});
			return NextResponse.json(allSystems, { status: 200 });
		} catch (err) {
			return NextResponse.json("Could not fetch devices", { status: 500 });
		}
	}
};

// POST - create new system in db
export const POST = async (request: NextRequest, { params }) => {
	const { name, description } = await request.json();
	try {
		const system = await prisma.system.create({
			data: {
				username: params.username,
				name: name,
				description: description,
			},
		});
		return NextResponse.json(system, { status: 200 });
	} catch (err) {
		return NextResponse.json("Could not create new system", { status: 500 });
	}
};
