import prisma from "~~/server/prisma";

export default defineEventHandler(async (event) => {
  try {

    const body = await readBody(event);
    const productId = body.productId;

    for (const number of body.numbers) {
      console.log('numberList', number);
      await prisma.numberSort.create({
        data: {
          number: number,
          productId: productId,
        },
      });
    }

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        formula: body.formula,
        active: false,
      },
    });

    setResponseStatus(event, 201)
    return { message: "Cliente adicionado com sucesso!" };

    // 560181
  } catch (e: any) {
    throw createError({
      status: 400,
      message: e.message,
    });
  }
});