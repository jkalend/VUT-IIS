/* 
GET - fetch all systems with given userId from db
POST - create new system in db
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