/*
GET - get device data for given deviceId

const device = await prisma.device.findUnique({
    where: {
        deviceId: params.deviceId
    }
})

PUT - edit device with given deviceId

const device = await prisma.device.findUnique({
    where: {
        deviceId: params.deviceId
    }
})

const updatedDevice = await prisma.device.update({
    where: {
        deviceId: params.deviceId
    },
    data: {
        alias?: alias | device.alias,
        type: { connect: { name: typeName } },
        systemId: systemId !== undefined ? systemId : (device && device.systemId),
        description: description
    }
})

DELETE - delete device with given user id

const deletedDevice = await prisma.device.delete({
    where: {
        deviceId: params.deviceId
    }
})


*/
