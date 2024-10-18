/*
.env

database: vip_laravel
DATABASE_USER=root
DATABASE_PASSWORD=root # não colocar @ no password
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3309
DATABASE_NAME=vip_laravel

database: vip_nuxt
DATABASE_USER=root
DATABASE_PASSWORD=root
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3309
DATABASE_NAME=vip_nuxt
*/

// importDBlaravel.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function migrateData() {
    // Conexão com o banco vip_laravel
    const laravelDb = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        port: process.env.DATABASE_PORT,
        password: process.env.DATABASE_PASSWORD,
        database: 'vip_laravel',
    });

    // Conexão com o banco vip_nuxt
    const nuxtDb = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        port: process.env.DATABASE_PORT,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    });

    try {

        // Obtém produtos relacionados
        const [products] = await laravelDb.execute('SELECT id, name, price FROM products');
        // Insere os produtos
        for (const product of products) {
            console.log('product', product);
            await nuxtDb.execute(
                'INSERT INTO product (id, name, price, saleMin) VALUES (?, ?, ?, ?)',
                [product.id, product.name, parseFloat(product.price), 10]
            );
        }

        // Seleciona todos os participantes
        const [participants] = await laravelDb.execute('SELECT * FROM participant');

        for (const participant of participants) {

            // Se o produto não for o 82, pula para o próximo participante
            // 82 é GOLF TSI BLUE EDITION ou 50 MIL REAIS
            if (participant.product_id !== 82) {
                continue;
            }

            // Insere o customer
            const phoneNumber = extractNumbers(participant.telephone)
            const [customerResult] = await nuxtDb.execute(
                'INSERT INTO customer (name, email, phone) VALUES (?, ?, ?)',
                [participant.name, participant.email, phoneNumber]
            );
            const customerId = customerResult.insertId;

            // Cria uma ordem para cada produto
            const [orderResult] = await nuxtDb.execute(
                'INSERT INTO `order` (customerId, createdAt) VALUES (?, ?)',
                [customerId, participant.created_at]
            );
            const orderId = orderResult.insertId;

            const numbers = JSON.parse(participant.numbers); // Assumindo que numbers é uma string JSON

            const [orderProductResult] = await nuxtDb.execute(
                'INSERT INTO `orderproduct` (quant, orderId, productId) VALUES (?, ?, ?)',
                [numbers.length, orderId, participant.product_id]
            );
            const orderProductId = orderProductResult.insertId;

            // Insere números em numberlist
            for (const number of numbers) {
                console.log('numberList', number);
                await nuxtDb.execute(
                    'INSERT INTO numberlist (number, orderproductId) VALUES (?, ?)',
                    [number, orderProductId]
                );
            }

        }

        console.log('Migração concluída com sucesso.');
    } catch (error) {
        console.error('Erro na migração:', error);
    } finally {
        await laravelDb.end();
        await nuxtDb.end();
    }
}

migrateData();


function extractNumbers(input) {
    return input.replace(/\D/g, '');
}