import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {
    const {username, password, devices, systems} = await request.json();
    console.log(username, password);
    try {
        const user = await prisma.user.create({
            data: {
                username: username,
                password: password,
                devices: {
                    create: devices,
                },
                systems: {
                    create: systems,
                },
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