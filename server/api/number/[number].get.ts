import fs from 'fs';
import prisma from "~~/server/prisma";

export default defineEventHandler(async (event: any) => {
    const number = event.context.params?.number
    const sorte = await prisma.numberlist.findFirst({
        include: {
            orderproduct: {
                include: {
                    order: {
                        include: {
                            customer: true
                        }
                    }
                }
            }
        },
        where: {
            number: number
        }
    })

    let logData = '';
    // Verifica se o arquivo já existe antes de escrever
    const filePath = 'consultations.log';
    if (!fs.existsSync(filePath)) {
        // cria o arquivo e escreve o cabeçalho
        logData += `Formula: (a * number + c) % m, onde a = 21, c = 1, m = 1000000\n`;
        logData += `Numeros gerados:\n`;
        fs.writeFileSync(filePath, logData);
    } else {
        logData += `${number}\n`;
    }

    fs.appendFile(filePath, logData, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });

    if (sorte) {
        return {
            body: sorte
        }
    } else {
        return
    }

});
