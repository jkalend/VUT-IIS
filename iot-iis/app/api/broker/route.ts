import prisma from "@/app/db";
import {NextRequest, NextResponse} from "next/server";

// POST - set new recent value for device using broker
export const POST = async (request: NextRequest) => {

    const { deviceId, recent_value, jwt } = await request.json();
    try {
        // TODO: authenticate broker using JWT (toto spravim este ja)
        let authenticated = true;

        if (!authenticated)
            return NextResponse.json("Could not authenticate broker", { status: 400 })

        // TODO: set recent value of device with deviceId from request to recent_value from request
        let new_value = 'add query here'
        
        return NextResponse.json(new_value, { status: 200 });
    } catch (err) {
        return NextResponse.json("Could not change recent value of device", { status: 500 });
    }

};