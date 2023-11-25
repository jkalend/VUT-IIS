import prisma from "@/app/db";
import {NextRequest, NextResponse} from "next/server";
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"

export const POST = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1))) {
        const { username_add } = await request.json();
		try {
            const user_exists = await prisma.user.findMany({
                where: {
                    username: username_add,
                },
            });
            if (user_exists.length == 0) {
                return NextResponse.json("User does not exist", {status: 400});
            }

            // create access of user_add to params.systemId
			const system_user = await prisma.system.update({
				where: {
					systemId: Number(params.systemId)
				},
				data: {
					allowed_users: {
						connect: {
							username: username_add
						}
					}
				}
			})
			const user_access = await prisma.user.update({
				where: {
					username: username
				},
				data: {
					allowed_systems: {
						connect: {
							systemId: Number(params.systemId)
						}
					}
				}
			})

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

            // remove username_del from params.systemId shared users
			const deletedAccess = await prisma.system.update({
				where: {
					systemId: Number(params.systemId)
				},
				data: {
					allowed_users: {
						disconnect: {
							username: username_del
						}
					}
				}
			})
			const deletedAccessUser = await prisma.user.update({
				where: {
					username: username_del
				},
				data: {
					allowed_systems: {
						disconnect: {
							systemId: Number(params.systemId)
						}
					}
				}
			})

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

            // fetch users with access to view system
			const users = await prisma.system.findUnique({
				where: {
					systemId: Number(params.systemId)
				},
				select: {
					allowed_users: true
				}
			})


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