import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server";

export async function DELETE(request: NextRequest, {params} : {params: {username: string}}) {
    const username = params.username;
    console.log(username);
    console.log(params.username);
    const res = await prisma.user.delete({
        where: {
            username: username,
        }
    })

    const allUsers = await prisma.user.findMany({
    })
    console.dir(allUsers, { depth: null })

    return Response.json(res)
}