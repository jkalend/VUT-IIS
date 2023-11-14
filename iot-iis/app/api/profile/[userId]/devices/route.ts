/*
GET - get all devices with given userId

const devices = await prisma.device.findMany({
    where: {
        userId: params.userId
    }
})

POST - create new device for given userId

const device = await prisma.device.create({
    data: {
        alias: alias,
        type: { connect: { name: typeName } },
        systemId: systemId,
        description: description,
        userId: { connect: { userId: params.userId } },
        brokerId: { connect: { userId: 1} },
        systemId: systemId !== undefined ? systemId : null,
    }
})

*/
