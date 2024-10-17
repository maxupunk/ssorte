import prisma from "~~/server/prisma";

export default defineEventHandler(async () => {
  try {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        pix: true,
        commissionPercent: true,
        rule: true,
        active: true,
      },
      orderBy: [
        { id: 'asc' }
      ],
    });
  } catch (e: any) {
    throw createError({
      status: 400,
      message: e.message,
    });
  }
});