import prisma from "@/app/db";
import {NextRequest, NextResponse} from "next/server";
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"

export const POST = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1))) {
		try {
            
            // TODO: create access of user_add to params.systemId
			const user_access = 'query here'

			return NextResponse.json(
				"Successully added acces of user to system",
				{ status: 200 }
			);
		} catch (err) {
			return NextResponse.json("Could add access to system", { status: 500 });
		}
	}
	else {
		return NextResponse.json("Unauthorized", {status: 400});
	}
}


// DELETE access for user to view system
export const DELETE = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1))) {
        const { username_del } = await request.json();
		try {

            // TODO: remove username_del from params.systemId shared users
			const deletedAccess = 'query here'

			return NextResponse.json(
				"Successfully removed access of user to system",
				{ status: 200 }
			);
		} catch (err) {
			return NextResponse.json("Could not delete access of user to system", { status: 500 });
		}
	}
	else {
		return NextResponse.json("Unauthorized", {status: 400});
	}
};

// GET - fetch all users with access to view system
export const GET = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1))) {
		try {

            // TODO: fetch users with access to view system
			const users = 'query here'


			return NextResponse.json(
				users,
				{ status: 200 }
			);
		} catch (err) {
			return NextResponse.json("Could not fetch users with access to view system", { status: 500 });
		}
	}
	else {
		return NextResponse.json("Unauthorized", {status: 400});
	}
};