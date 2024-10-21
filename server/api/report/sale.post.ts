import prisma from "~~/server/prisma";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const userID = Number(body.userId);
    const dateStart = body.dateStart ? new Date(body.dateStart as string) : undefined;
    const dateEnd = body.dateEnd ? new Date(body.dateEnd as string) : undefined;
    if (dateEnd) {
        dateEnd.setHours(23, 59, 59, 999);
    }
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                name: 'desc',
            },
            where: {
                id: userID || undefined,
                order: {
                    some: {
                        createdAt: {
                            gte: dateStart,
                            lte: dateEnd,
                        },
                    },
                },
            },
            include: {
                order: {
                    include: {
                        orderproduct: {
                            include: {
                                product: true,
                                numberlist: true,
                            },
                        },
                    },
                },
            },
        });

        const result = users.map((user) => {
            let totalAmount = 0;
            user.order.forEach((order) => {
                order.orderproduct.forEach((orderProduct: any) => {
                    totalAmount += orderProduct.numberlist.length * orderProduct.product.price;
                });
            });
            return {
                name: user.name,
                total: parseFloat(totalAmount.toFixed(2)),
            };
        });

        return result;
    } catch (e: any) {
        throw createError({
            status: 400,
            message: e.message,
        });
    }
});