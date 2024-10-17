import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("admin", 10)
    await prisma.user.create({
        data: {
            email: 'admin',
            name: 'John Doe',
            password: hashedPassword,
            rule: 'admin',
        },
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });