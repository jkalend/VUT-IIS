/* 

DELETE - delete device from system with given systemId NOT COMPLETELY

const deletedDevice = await prisma.device.update({
    where: {
        userId: params.userId,
        deviceId: params.deviceId,
    },
    data: {
        systemId: null,
    }
})

POST - add device to system

*/

import prisma from "@/app/db";
import { NextRequest } from "next/server"

export const GET = async (request: NextRequest, { params }) => {
    // userId = params.userId
    try {

        //co tady? :pepela:

    }
    catch (err) {

    }
}

export const POST = async (request: NextRequest, { params }) => {
    // userId = params.userId
    const {name, description} = await request.json();
    try {

        const addedDevice = await prisma.device.update({
          where: {
            userId: params.userId,
            deviceId: deviceId, //tady se nejak musi dostat to ID
          },
          data: {
            systemId: systemId, //tady se nejak musi dostat to ID
          },
        });

    }
    catch (err) {

    }
}