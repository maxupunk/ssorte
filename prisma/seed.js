import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Ensure the customer exists or create a new one
    const customer = await prisma.customer.upsert({
        where: { email: 'john@example.com' },
        update: {},
        create: {
            email: 'john@example.com',
            name: 'John Doe', // Add other required fields
        },
    });

    // Create orderproduto items for the order
    await prisma.orderproduct.create({
        data: {
            order: {
                create: {
                    customer: {
                        connect: { email: 'john@example.com' },
                    },
                },
            },
            product: {
                create: {
                    name: 'Sorteio Golf',
                    price: 0.99,
                },
            },
            quant: 2,
            numberlist: {
                create: {
                    number: 999999,
                },
            },
        },
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });