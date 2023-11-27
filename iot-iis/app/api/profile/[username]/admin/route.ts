// @ts-nocheck
/* fetch all users from db */

import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"
import { authOptions } from "@/app/api/auth/\[...nextauth\]/route"
import { getServerSession } from "next-auth/next"

// GET - all user in system
export const GET = async (request: NextRequest, response: NextResponse) => {
    const session = await getServerSession(authOptions)
    if (session && session.is_admin == 1) {
        try {
            const users = await prisma.user.findMany({
                where: {
                    admin_flag: 0
                }
            });
            return NextResponse.json(users, {status: 200});
        } catch (error) {
            return NextResponse.json(error, {status: 500});
        }
    }
    else {
        return NextResponse.json("Unauthorized", {status: 400});
    }
}
