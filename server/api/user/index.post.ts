import prisma from "~~/server/prisma";
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
  let body = await readBody(event);

  try {
    const userSelect = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: body.email,
          },
          {
            phone: body.phone,
          },
          {
            name: body.name,
          },
        ],
      },
    });

    if (userSelect) {
      throw createError({
        status: 400,
        message: 'Esse nome de usuário ou email ou telefone já existe',
      });
    }

    const user:any = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      pix: body.pix,
      commissionPercent: parseFloat(body.commissionPercent),
      rule: body.rule,
      active: body.active,
    }

    if (body.password !== undefined) {
      const password = body.password;
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await prisma.user.create({
      data: user,
    });

    return { message: 'Usuário cadastrado com sucesso' };
  } catch (e: any) {
    throw createError({
      status: 400,
      message: e.message,
    });
  }
});