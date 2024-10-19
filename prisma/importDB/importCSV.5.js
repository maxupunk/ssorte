import fs from 'fs';
import { parse } from 'csv-parse';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Caminho do arquivo CSV
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputFilePath = path.join(__dirname, 'bilhetes_5_total.csv');
dotenv.config();

// MySQL connection configuration
const dbConfig = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
};

// Function to process the CSV file and update the database
async function processCSV() {
    const connection = await mysql.createConnection(dbConfig);

    const parser = fs.createReadStream(inputFilePath)
        .pipe(parse({ delimiter: ',', from_line: 1 }));

    for await (const row of parser) {
        const number = row[1];
        const name = row[7];
        const phone = row[8];

        try {
            // Check if the number exists in the numberlist table
            const [numberlistRows] = await connection.execute(
                'SELECT number, orderproductId FROM numberlist WHERE number = ?',
                [number]
            );

            if (numberlistRows.length > 0) {
                const orderproductId = numberlistRows[0].orderproductId;

                console.log('number:', number, name, phone);
                // Get the orderId from the orderproduct table
                const [orderproductRows] = await connection.execute(
                    'SELECT orderId FROM orderproduct WHERE id = ?',
                    [orderproductId]
                );

                if (orderproductRows.length > 0) {
                    const orderId = orderproductRows[0].orderId;

                    // Get the customerId from the order table
                    const [orderRows] = await connection.execute(
                        'SELECT customerId FROM `order` WHERE id = ?',
                        [orderId]
                    );

                    if (orderRows.length > 0) {
                        const customerId = orderRows[0].customerId;

                        // Update the customer table with the name and phone
                        await connection.execute(
                            'UPDATE customer SET name = ?, phone = ? WHERE id = ?',
                            [name, phone, customerId]
                        );
                    }
                }
            }
        } catch (error) {
            console.error('Error processing row:', error);
        }
    }

    console.log('CSV file successfully processed');
    await connection.end();
}

// Run the function to process the CSV file
processCSV();