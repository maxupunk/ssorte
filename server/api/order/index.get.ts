import prisma from "~~/server/prisma";

export default defineEventHandler(async (event) => {
  // const user = event.context.user;
  let searchConditions = {};

  const query = getQuery(event)
  if (query.search) {
    searchConditions = {
      OR: [
        {
          customer: {
            phone: {
              startsWith: query.search,
            },
          },
        },
        {
          customer: {
            name: {
              startsWith: query.search,
            },
          },
        },
        {
          orderproduct: {
            some: {
              numberlist: {
                some: {
                  number: {
                    startsWith: query.search,
                  },
                },
              },
            },
          },
        },
      ],
    };
  }

  try {
    const customerResp = await prisma.order.findMany({
      orderBy: [
        { id: 'desc' }
      ],
      take: 100,
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
      where: {
        // ...user.rule !== 'admin' ? { userId: user.id } : {},
        ...searchConditions
      }
    });
    return customerResp;
  } catch (e: any) {
    throw createError({
      status: 400,
      message: e.message,
    });
  }
});