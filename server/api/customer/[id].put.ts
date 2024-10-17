import prisma from "~~/server/prisma";

export default defineEventHandler(async (event) => {
    try {
        const customerId = Number(event.context.params?.id);
        let body = await readBody(event);
        if (body.id) delete body.id;

        await prisma.customer.update({
            where: { id: customerId },
            data: body,
        });

        return { message: 'Usuário atualizado com sucesso!' };
    } catch (e: any) {
        throw createError({
            status: 400,
            message: e.message,
        });
    }
});