/*

retirar do banco de dados do laravel e importar para esse sistema
estrutura usadas foram as seguintes:

database: vip_laravel

CREATE TABLE `participant` (
    `id` int(10) UNSIGNED NOT NULL,
    `customer_id` int(10) UNSIGNED DEFAULT NULL,
    `name` varchar(191) NOT NULL,
    `telephone` varchar(191) NOT NULL,
    `conferido` tinyint(1) NOT NULL DEFAULT 1,
    `email` varchar(191) NOT NULL,
    `cpf` varchar(191) NOT NULL,
    `raffles_id` int(10) UNSIGNED DEFAULT NULL,
    `product_id` int(10) UNSIGNED NOT NULL,
    `valor` double(8,2) NOT NULL DEFAULT 0.00,
    `numbers` longtext DEFAULT NULL,
    `pagos` int(11) NOT NULL DEFAULT 0,
    `reservados` int(11) NOT NULL DEFAULT 0,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE `products` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `subname` varchar(191) DEFAULT NULL,
  `parcial` tinyint(1) NOT NULL DEFAULT 0,
  `expiracao` int(11) NOT NULL DEFAULT 5,
  `qtd_ranking` int(11) NOT NULL DEFAULT 0,
  `qtd_zeros` int(11) DEFAULT NULL,
  `product` varchar(191) DEFAULT NULL,
  `slug` longtext DEFAULT NULL,
  `price` varchar(191) NOT NULL,
  `ganho_afiliado` int(11) NOT NULL DEFAULT 0,
  `status` varchar(191) NOT NULL,
  `qtd` int(11) DEFAULT NULL,
  `numbers` longtext DEFAULT NULL,
  `processado` int(11) NOT NULL DEFAULT 0,
  `type_raffles` varchar(191) NOT NULL,
  `favoritar` tinyint(1) NOT NULL,
  `modo_de_jogo` varchar(191) NOT NULL,
  `minimo` int(11) NOT NULL,
  `maximo` int(11) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `draw_prediction` datetime DEFAULT NULL,
  `draw_date` datetime DEFAULT NULL,
  `winner` longtext DEFAULT NULL,
  `visible` tinyint(1) DEFAULT NULL,
  `gateway` varchar(191) NOT NULL DEFAULT 'mp',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
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
        database: 'vip_laravel',
    });

    // Conexão com o banco vip_nuxt
    const nuxtDb = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'vip_nuxt',
    });

    try {

        // Obtém produtos relacionados
        const [products] = await laravelDb.execute('SELECT id, name, price FROM products');
        // Insere os produtos
        for (const product of products) {
            console.log('product', product);
            await nuxtDb.execute(
                'INSERT INTO product (id, name, price) VALUES (?, ?, ?)',
                [product.id, product.name, parseFloat(product.price)]
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

            const phoneNumber = extractNumbers(participant.telephone)
            // Insere o customer
            const contacts = JSON.stringify({ telephone: phoneNumber });
            const [customerResult] = await nuxtDb.execute(
                'INSERT INTO customer (name, email, contacts) VALUES (?, ?, ?)',
                [participant.name, participant.email, contacts]
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