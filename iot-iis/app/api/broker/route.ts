import prisma from "@/app/db";
import {NextRequest, NextResponse} from "next/server";
import jwt from "jsonwebtoken"

// POST - set new recent value for device using broker
export const POST = async (request: NextRequest) => {

    const req  = await request.json();
    try {
        // TODO: authenticate broker using JWT (toto spravim este ja)
        let authenticated = false;
        let data = jwt.decode (req.token, {complete: true})
        if (data.payload.username == "cultsauce" && data.payload.password == "cultsauce")
            authenticated = true;

        if (!authenticated)
            return NextResponse.json("Could not authenticate broker", { status: 400 })

        // set recent value of device with deviceId, paramId from request to recent_value from request
        let new_value = await prisma.device.update({
            where: {
                deviceId: data.payload.deviceId
                parameterId: data.payload.paramId
            },
            data: {
                recentValue: data.payload.recentValue
            }
        });

        // TODO: fetch parameter with data.payload.paramId
        const allowed_values = 'query'
        
        // TODO: skontrolovat ci hodnota od brokera je ok s danym parametrom - to spravim ja

        return NextResponse.json(new_value, { status: 200 });
    } catch (err) {
        console.log (err)
        return NextResponse.json("Could not change recent value of device", { status: 500 });
    }

};