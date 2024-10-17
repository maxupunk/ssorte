import prisma from "~~/server/prisma";

export default defineEventHandler(async () => {
  try {
    const customerResp = await prisma.customer.findMany({
      orderBy: [
        { id: 'asc' }
      ],
    });
    return customerResp;
  } catch (e: any) {
    throw createError({
      status: 400,
      message: e.message,
    });
  }
});