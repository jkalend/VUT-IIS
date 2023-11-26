import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"

export const GET = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.is_admin == 1))) {
		try {
			const sharedSystems = await prisma.user.findUnique({
				where: {
                    username: params.username,
                },
                select: {
                    allowed_systems: true,
                },
            });
			return NextResponse.json(sharedSystems, { status: 200 });
		} catch (err) {
			return NextResponse.json("Could not fetch systems", { status: 500 });
		}
	}
	else {
		return NextResponse.json("Unauthorized", {status: 400});
	}
};