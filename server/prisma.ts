import { PrismaClient } from '@prisma/client'

const config = useRuntimeConfig();

console.log('DB', config.bdUrl)

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: config.bdUrl
        }
    }
})

export default prisma