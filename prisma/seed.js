import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
})

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