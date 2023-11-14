/*
PUT - edit given name or description

const system = await prisma.system.findUnique({
    where: {
        systemId: params.systemId
    }
})

const updatedSystem = await prisma.system.update({
    where: {
        systemId: params.systemId
    },
    data: {
        name: name !== undefined ? name : (system && system.name),
        description: description !== undefined ? description : (system && system.description)
    }
})

DELETE - delete system from db

const deletedSystem = await prisma.system.delete({
    where: {
        systemId: params.systemId
    }
})

*/
