/* 
GET - fetch all systems with given userId from db
POST - create new system in db
*/
import prisma from "@/app/db";
import { NextRequest } from "next/server"

export const GET = async (request: NextRequest, { params }) => {
    // userId = params.userId
    try {

        const allSystems = await prisma.system.findMany({
            where: {
                userId: params.userId
            }
        })

    }
    catch (err) {

    }
}

export const POST = async (request: NextRequest, { params }) => {
    // userId = params.userId
    const {name, description} = await request.json();
    try {

        const system = await prisma.system.create({
            data: {
                userId: params.userId,
                name: name,
                description: description
            }
        })

    }
    catch (err) {

    }
}