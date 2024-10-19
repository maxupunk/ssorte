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
        disabled: true,
      },
    });

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: 1,
      },
    });

    return { message: "Venda desabilitada com sucesso" };
  } catch (e: any) {
    throw createError({
      status: 400,
      message: e.message,
    });
  }
});