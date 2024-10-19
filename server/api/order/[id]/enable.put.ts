import prisma from "~~/server/prisma";

export default defineEventHandler(async (event) => {
  try {
    const orderId = Number(event.context.params?.id);

    await prisma.numberlist.updateMany({
      where: {
        orderproduct: {
          orderId: orderId,
        },
      },
      data: {
        disabled: false,
      },
    });

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: 0,
      },
    });

    return { message: "Venda abilitada com sucesso" };
  } catch (e: any) {
    throw createError({
      status: 400,
      message: e.message,
    });
  }
});