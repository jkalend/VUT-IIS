import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"
import bcrypt from 'bcrypt'

/* GET - public route - get metadata about a user */
export const GET = async (request: NextRequest, {params}) => {
    try {
        const devices = await prisma.device.count({
            where: {
                username: params.username
            },
        });
        const systems = await prisma.system.count({
            where: {
                username: params.username
            }
        });
        return NextResponse.json({"devices": devices, "systems": systems}, {status: 200});
    } catch (error) {
        console.log("err: ", error)
        return NextResponse.json(error, {status: 500});
    }
}

// PUT change password
export const PUT = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
    if (session && session.user?.username == params.username) {
		const { new_pwd, old_pwd } = await request.json();
		try {
            // fetch password of user with params.username
			let user = await prisma.user.findUnique({
                where: {
                    username: params.username
                },
                select: {
                    password: true
                }
            })

            let pwd_check = await bcrypt.hash (old_pwd, 10)
            let valid = bcrypt.compare (pwd_check, user.password)
            if (!valid)
                return NextResponse.json("Wrong password", {status: 400});

            let new_pwd_hash = await bcrypt.hash (new_pwd, 10)
            // TODO: set password of user with params.username to new_pwd_hash

			return NextResponse.json("Password changed successfully", { status: 200 });
		} catch (err) {
			return NextResponse.json("Could not change password", { status: 500 });
		}
	}
	else {
		return NextResponse.json("Unauthorized", {status: 400});
	}
}

// DELETE - delete user with params.username
export const DELETE = async (request: NextRequest, { params }) => {
	const session = await getServerSession(authOptions)
    if (session && ((session.user?.username == params.username) || (session.user?.is_admin == 1))) {
		try {
            //fetch user with params.username
            let user = await prisma.user.findUnique({
                where: {
                    username: params.username
                },
                select: {
                    admin_flag: true
                }
            })
            if (user.admin_flag == 1) 
                return NextResponse.json("Admin account cannot be deleted", { status: 400 });
            
            // delete user with params.username and CASCADE CONSTRAINTS (mozno to je default v prisme idk)
            await prisma.user.delete({
                where: {
                    username: params.username
                }
            })

			return NextResponse.json("Account deleted successfully", { status: 200 });
		} catch (err) {
			return NextResponse.json("Could not delete user", { status: 500 });
		}
	}
	else {
		return NextResponse.json("Unauthorized", {status: 400});
	}
}