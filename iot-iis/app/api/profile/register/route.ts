// @ts-nocheck
import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (request: NextRequest) => {
	const { username, password } = await request.json();
	let pwd: String = await bcrypt.hash(password, 10);
	try {
		const allUsers = await prisma.user.findMany({
			where: {
				username: username,
			},
		});
		if (allUsers.length != 0) {
			/* user already exists */
			return NextResponse.json("User already exists", { status: 400 });
		}

		const user = await prisma.user.create({
			data: {
				username: username,
				password: pwd as string,
			},
		});
		return NextResponse.json(user, { status: 200 });
	} catch (err) {
		return NextResponse.json("Could not create new user", { status: 500 });
	}
};
