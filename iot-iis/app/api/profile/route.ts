import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server"

// GET - first 5x4 users in system
export const GET = async (request: NextRequest, response: NextResponse) => {
    try {
        const users = await prisma.user.findMany({
            take: 20,
            select: {
                username: true,
                admin_flag: false,
            }
        });
        return NextResponse.json(users, {status: 200});
    } catch (error) {
        console.log("err: ", error)
        return NextResponse.json(error, {status: 500});
    }
}