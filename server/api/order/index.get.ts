import prisma from "~~/server/prisma";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  try {
    const customerResp = await prisma.order.findMany({
      orderBy: [
        { id: 'asc' }
      ],
      include: {
        customer: true,
        user: true,
        finance: true,
        orderproduct: {
          include: {
            product: true,
            numberlist: true
          }
        }
      },
      where: user.rule !== 'admin' ? { userId: user.id } : {}
    });
    return customerResp;
  } catch (e: any) {
    throw createError({
      status: 400,
      message: e.message,
    });
  }
});