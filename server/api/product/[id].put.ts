import prisma from "~~/server/prisma";

export default defineEventHandler(async (event) => {
    try {
        const produtcId = Number(event.context.params?.id);
        let body = await readBody(event);

        const product = {
            name: body.name,
            price: parseFloat(body.price),
            description: body.description,
            image: body.image,
            saleMin: Number(body.saleMin),
            numberMax: Number(body.numberMax),
            numberMin: Number(body.numberMin),
            numLottery: body.numLottery,
            active: body.active,
        }

        await prisma.product.update({
            where: { id: produtcId },
            data: product,
        });

        return { message: 'Usuário atualizado com sucesso!' };
    } catch (e: any) {
        throw createError({
            status: 400,
            message: e.message,
        });
    }
});