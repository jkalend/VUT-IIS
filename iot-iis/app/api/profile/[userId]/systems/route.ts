import prisma from "@/app/db";
import { NextRequest } from "next/server"

// GET - all systems with given userId
export const GET = async (request: NextRequest, { params }) => {
    try {
        const allSystems = await prisma.system.findMany({
            where: {
                userId: params.userId
            }
        })
        return new Response(JSON.stringify(allSystems), {status: 200});
    }
    catch (err) {
        return new Response("Could not fetch devices", {status: 500});
    }
}

// POST - create new system in db
export const POST = async (request: NextRequest, { params }) => {
    const {name, description} = await request.json();
    try {

        const system = await prisma.system.create({
            data: {
                userId: params.userId,
                name: name,
                description: description
            }
        })
        return new Response(JSON.stringify(system), {status: 200});
    }
    catch (err) {
        return new Response("Could not create new system", {status: 500});
    }
}