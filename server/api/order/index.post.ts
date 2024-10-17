import prisma from "~~/server/prisma";

export default defineEventHandler(async (event) => {
  try {

    const user = event.context.user;

    let body = await readBody(event);

    let customerQuery = await prisma.customer.findFirst({
      where: {
        phone: body.customer.phone,
      }
    });

    if (!customerQuery) {
      customerQuery = await prisma.customer.create({
        data: {
          name: body.customer.name,
          phone: body.customer.phone,
        }
      });
    }

    const product = await prisma.product.findFirst({
      where: {
        id: body.orderProduct.productId,
      }
    });

    if (!product) {
      throw createError({
        status: 400,
        message: 'Produto não encontrado',
      });
    }

    let order = await prisma.order.create({
      data: {
        user: {
          connect: {
            id: user.id,
          }
        },
        customer: {
          connect: {
            id: customerQuery.id,
          }
        },
        finance: {
          create: {
            description: `Venda de ${user.name}`,
            price: body.orderProduct.quant * product.price,
            status: body.paid ? 1 : 0,
          }
        }
      }
    })

    const orderProduct = await prisma.orderproduct.create({
      data: {
        order: {
          connect: {
            id: order.id,
          },
        },
        product: {
          connect: {
            id: product.id,
          }
        },
        quant: body.orderProduct.quant,
      }
    });

    let quantAtual = 0;
    while (quantAtual < body.orderProduct.quant) {
      const number = generateRandomNumber()
      const numberList = await prisma.numberlist.findFirst({
        where: {
          number: number,
        }
      });

      if (!numberList) {
        await prisma.numberlist.create({
          data: {
            number: number,
            orderproduct: {
              connect: {
                id: orderProduct.id,
              }
            }
          }
        });
        quantAtual++;
      }
    }

    const orderQuery = await prisma.order.findUnique({
      where: {
        id: order.id,
      },
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
      }
    });

    setResponseStatus(event, 201)
    return { message: "Cliente adicionado com sucesso!", order: orderQuery };
  } catch (e: any) {
    throw createError({
      status: 400,
      message: e.message,
    });
  }
});

function generateRandomNumber() {
  const min = 1;
  const max = 999999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return String(randomNumber).padStart(6, '0');
}