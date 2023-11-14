/* 

DELETE - delete device from system with given systemId NOT COMPLETELY
POST - add device to system

*/

import { NextRequest } from "next/server"

export const GET = async (request: NextRequest, { params }) => {
    // userId = params.userId
    try {

    }
    catch (err) {

    }
}

export const POST = async (request: NextRequest, { params }) => {
    // userId = params.userId
    const {name, description} = await request.json();
    try {

    }
    catch (err) {

    }
}