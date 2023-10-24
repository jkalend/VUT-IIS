import prisma from '../../db'
import {NextApiRequest, NextApiResponse} from "next";

export async function POST(req: Request) {
    const {username, password, email} = await req.json();
    console.log(username, password, email);
    try {
        const user = await prisma.user.create({
            data: {
                username: username,
                password: password,
                email: email,
            },
        })

        const allUsers = await prisma.user.findMany({})
        console.dir(allUsers, {depth: null})

        return Response.json(user)
    } catch (e) {
        console.error("Couldn't create user:", e);
        throw e;
    }
}

export async function DELETE() {
    const res = await prisma.user.delete({
        where: {
            email: 'idk@idk.com',
        }
    })

    const allUsers = await prisma.user.findMany({
    })
    console.dir(allUsers, { depth: null })

    return Response.json(res)
}