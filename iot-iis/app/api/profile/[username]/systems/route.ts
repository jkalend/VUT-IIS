import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"

// GET - all systems with given userId
export const GET = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1))) {
		try {
			const allSystems = await prisma.system.findMany({
				where: {
					username: params.username,
				},
				//include: { toto tu ma byt ? ked fetchujes iba systemy
				//	devices: true,
				//}
			});
			return NextResponse.json(allSystems, { status: 200 });
		} catch (err) {
			return NextResponse.json("Could not fetch systems", { status: 500 });
		}
	}
	else {
		return NextResponse.json("Unauthorized", {status: 400});
	}
};

// POST - create new system in db
export const POST = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
    if (session && session.user?.username == params.username) {
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
	}
	else {
		return NextResponse.json("Unauthorized", {status: 400});
	}
};
