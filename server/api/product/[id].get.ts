import prisma from "~~/server/prisma";

export default defineEventHandler(async (event) => {
    try {
        const productId = Number(event.context.params?.id);

        const productQuery = await prisma.product.findUnique({
            where: { id: productId },
        });

        return productQuery;
    } catch (e: any) {
        return {
            status: 400,
            message: e.message,
        };
    }
});