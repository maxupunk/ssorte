/*

*/

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
    database: 'vip_novo',
  });

  // Conexão com o banco vip_nuxt
  const nuxtDb = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
  });

  try {

    // no banco atual prodct ID 67 é o GOLF TSI BLUE EDITION ou 50 MIL REAIS
    const product_id = 82;

    // Seleciona todos os participantes
    const [order_lists] = await laravelDb.execute('SELECT * FROM order_list');

    for (const orderList of order_lists) {

      // Verifica se o produto é diferente do produto que queremos migrar
      if (orderList.product_id !== 67 || orderList.status == 2) {
        continue
      }

      // Insere o customer
      const [[participant]] = await laravelDb.execute('SELECT * FROM customer_list WHERE id = ?', [orderList.customer_id]);
      const [customerResult] = await nuxtDb.execute(
        'INSERT INTO customer (name, email, phone) VALUES (?, ?, ?)',
        [`${participant.firstname} ${participant.lastname}`, participant.email, participant.phone]
      );
      const customerId = customerResult.insertId;

      // Cria uma ordem para cada produto
      const [orderResult] = await nuxtDb.execute(
        'INSERT INTO `order` (customerId, createdAt) VALUES (?, ?)',
        [customerId, participant.date_created]
      );
      const orderId = orderResult.insertId;

      const numbers = orderList.order_numbers.split(',')
      const [orderProductResult] = await nuxtDb.execute(
        'INSERT INTO `orderproduct` (quant, orderId, productId) VALUES (?, ?, ?)',
        [numbers.length, orderId, product_id]
      );
      const orderProductId = orderProductResult.insertId;

      // Insere números em numberlist
      for (const number of numbers) {
        console.log('numberList', number);
        if (number === '') {
          continue
        }
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