/*

retirar do banco de dados do laravel e importar para esse sistema
estrutura usadas foram as seguintes:

database: vip_novo

CREATE TABLE `customer_list` (
  `id` int(30) NOT NULL,
  `firstname` text NOT NULL,
  `lastname` text NOT NULL,
  `phone` text NOT NULL,
  `email` text DEFAULT NULL,
  `password` text DEFAULT NULL,
  `avatar` text DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_updated` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cpf` text DEFAULT NULL,
  `zipcode` text DEFAULT NULL,
  `address` text DEFAULT NULL,
  `number` text DEFAULT NULL,
  `neighborhood` text DEFAULT NULL,
  `complement` text DEFAULT NULL,
  `state` text DEFAULT NULL,
  `city` text DEFAULT NULL,
  `reference_point` text DEFAULT NULL,
  `is_affiliate` tinyint(1) DEFAULT 0,
  `birth` date DEFAULT NULL,
  `instagram` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_list` (
  `id` int(30) NOT NULL,
  `code` varchar(100) DEFAULT NULL,
  `customer_id` int(30) DEFAULT NULL,
  `quantity` text DEFAULT NULL,
  `order_numbers` longtext DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


database: vip_nuxt

CREATE TABLE IF NOT EXISTS `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contacts` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Customer_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- vip_nuxt.numberlist
CREATE TABLE IF NOT EXISTS `numberlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `number` int NOT NULL,
  `disabled` tinyint(1) DEFAULT '0',
  `orderproductId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `NumberList_orderProductId_fkey` (`orderproductId`),
  CONSTRAINT `NumberList_orderProductId_fkey` FOREIGN KEY (`orderproductId`) REFERENCES `orderproduct` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- vip_nuxt.order
CREATE TABLE IF NOT EXISTS `order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customerId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Order_customerId_fkey` (`customerId`),
  CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- vip_nuxt.orderproduct
CREATE TABLE IF NOT EXISTS `orderproduct` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quant` int NOT NULL,
  `orderId` int NOT NULL,
  `productId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `OrderProduct_productId_fkey` (`productId`),
  KEY `OrderProduct_orderId_fkey` (`orderId`),
  CONSTRAINT `OrderProduct_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `OrderProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- vip_nuxt.product
CREATE TABLE IF NOT EXISTS `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

*/

// importDBlaravel.js
import mysql from 'mysql2/promise';

async function migrateData() {
    // Conexão com o banco vip_laravel
    const laravelDb = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'vip_novo',
    });

    // Conexão com o banco vip_nuxt
    const nuxtDb = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'vip_nuxt',
    });

    try {

        // no banco atual prodct ID 67 é o GOLF TSI BLUE EDITION ou 50 MIL REAIS
        const product_id = 82;

        // Seleciona todos os participantes
        const [order_lists] = await laravelDb.execute('SELECT * FROM order_list');

        for (const orderList of order_lists) {

            // Verifica se o produto é diferente do produto que queremos migrar
            if (orderList.product_id != 67) {
                continue
            }

            // Insere o customer
            const [[participant]] = await laravelDb.execute('SELECT * FROM customer_list WHERE id = ?', [orderList.customer_id]);
            const contacts = JSON.stringify({ telephone: participant.phone });
            const [customerResult] = await nuxtDb.execute(
                'INSERT INTO customer (name, email, contacts) VALUES (?, ?, ?)',
                [`${participant.firstname} ${participant.lastname}`, participant.email, contacts]
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