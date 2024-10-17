import prisma from "~~/server/prisma";

export default defineEventHandler(async (event) => {
  try {
    let body = await readBody(event);
    const customerCreted = await prisma.customer.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
      },
    });
    if (customerCreted) {
      setResponseStatus(event, 201)
      return { message: "Cliente adicionado com sucesso!" };
    }
  } catch (e: any) {
    throw createError({
      status: 400,
      message: e.message,
    });
  }
});