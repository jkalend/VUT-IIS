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
        if (allUsers.length != 1 ||
            await bcrypt.compare (allUsers[0].password, pwd)) { /* user does not exist or the password is incorrect */
            
            return new Response("Double check password or username", {status: 400});
        }

        console.log ("userid:", user.userId);
        const token = await jwt.sign({ userId: user.userId }, process.env.JWT_TOKEN, {
                    expiresIn: 31556926,
            });
        return NextResponse.json({ token, user });
    } catch (err) {
        return new Response("Could not log in user", {status: 500})
    }
}