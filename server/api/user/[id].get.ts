import prisma from "~~/server/prisma";

export default defineEventHandler(async (event) => {
    try {
        const id = Number(event.context.params?.id);

        return await prisma.user.findUnique({
            where: { id: id },
        });
    } catch (e: any) {
        return {
            status: 400,
            message: e.message,
        };
    }
});