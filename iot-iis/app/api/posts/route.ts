import prisma from '../../db'

export async function POST() {
    const res = await prisma.user.create({
        data: {
            name: 'Alice',
            email: 'alice@prisma.io',
        },
    })

    const allUsers = await prisma.user.findMany({
    })
    console.dir(allUsers, { depth: null })

    return Response.json(res)
}

export async function DELETE() {
    const res = await prisma.user.delete({
        where: {
            email: 'alice@prisma.io',
        }
    })

    const allUsers = await prisma.user.findMany({
    })
    console.dir(allUsers, { depth: null })

    return Response.json(res)
}