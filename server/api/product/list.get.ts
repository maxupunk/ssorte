import prisma from "~~/server/prisma";

export default defineEventHandler(async () => {
  try {
    const productResp = await prisma.product.findMany({
      where: {
        active: true
      },
      orderBy: [
        { id: 'asc' }
      ],
    });
    return productResp;
  } catch (e: any) {
    throw createError({
      status: 400,
      message: e.message,
    });
  }
});