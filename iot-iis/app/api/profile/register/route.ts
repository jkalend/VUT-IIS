import prisma from '@/app/db'
import {NextRequest, NextResponse} from "next/server";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

export const POST = async (request: NextRequest) => {
    const {username, password} = await request.json();
    let pwd: String = await bcrypt.hash (password, 10);    
    try {
        const allUsers = await prisma.user.findMany({
            where: {
                username: username
            }
        })
        if (allUsers.length != 0) { /* user already exists */
            console.log ("all users length =", allUsers.length)
            return new Response("User already exists", {status: 400});
        }

        const user = await prisma.user.create({
            data: {
                username: username,
                password: pwd as string,
            },
        })
        console.log ("userid:", user.userId);
        const token = await jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
                    expiresIn: 31556926,
            });
        return NextResponse.json({ token, user });
    } catch (err) {
        return new Response("Could not create new user", {status: 500})
    }
}