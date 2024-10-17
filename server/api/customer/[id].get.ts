import prisma from "~~/server/prisma";

export default defineEventHandler(async (event) => {
    try {
        const customerId = Number(event.context.params?.id);

        const productQuery = await prisma.customer.findUnique({
            where: { id: customerId },
        });

        return productQuery;
    } catch (e: any) {
        return {
            status: 400,
            message: e.message,
        };
    }
});