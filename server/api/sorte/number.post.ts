import prisma from "~~/server/prisma";

export default defineEventHandler(async (event: any) => {
    const body = await readBody(event);
    const sorte = await prisma.numberlist.findFirst({
        include: {
            orderproduct: {
                include: {
                    order: {
                        include: {
                            customer: true
                        }
                    },
                    product: {
                        where: {
                            id: body.productId
                        }
                    }
                }
            }
        },
        where: {
            number: body.number
        }
    })

    if (sorte) {
        return sorte
    } else {
        return
    }

});
