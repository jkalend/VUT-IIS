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

        // fetch parameter with data.payload.paramId
        const ok_vals = await prisma.parameter.findUnique({
            where: {
                parameterId: data.payload.paramId
            }
        });
    
        if (ok_vals?.valuesFrom > Number(data.payload.recentValue) ||
            ok_vals?.valuesTo < Number(data.payload.recentValue)) {
                return NextResponse.json("Wrong values", { status: 400 });
        }
        // set recent value of device with deviceId, paramId from request to recent_value from request
        const value = await prisma.value.findUnique({
            where: {
                deviceId: Number(data.payload.deviceId),
                parameterId: Number(data.payload.paramId)
            }
        });
        const new_value = await prisma.value.update({
            where: {
                valueId: Number(value.valueId)
            },
            data: {
                recentValue: Number(data.payload.recentValue)
            }
        });
        return NextResponse.json(new_value, { status: 200 });
    } catch (err) {
        console.log (err)
        return NextResponse.json("Could not change recent value of device" + err, { status: 500 });
    }

};