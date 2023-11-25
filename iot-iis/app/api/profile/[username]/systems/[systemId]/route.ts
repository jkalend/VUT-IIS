import prisma from "@/app/db";
import {NextRequest, NextResponse} from "next/server";
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"

// PUT - change system info
export const PUT = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1))) {
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
	}
	else {
		return NextResponse.json("Unauthorized", {status: 400});
	}
};

// DELETE system from db
export const DELETE = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1))) {
		try {
			const deletedSystem = await prisma.system.delete({
				where: {
					systemId: Number(params.systemId),
				},
			});
			return NextResponse.json(
				`Successfuly deleted system ${deletedSystem.systemId}`,
				{ status: 200 }
			);
		} catch (err) {
			return NextResponse.json("Could not delete system", { status: 500 });
		}
	}
	else {
		return NextResponse.json("Unauthorized", {status: 400});
	}
};

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
		// do nothing
	}
	if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1) || (has_access))) {
		try {
			const system = await prisma.system.findUnique({
				where: {
					systemId: Number(params.systemId),
				},
			});
			return NextResponse.json(system, { status: 200 });
		} catch (err) {
			return NextResponse.json("Could not fetch system info", { status: 500 });
		}
	}
	else {
		return NextResponse.json("Unauthorized", {status: 400});
	}
};
