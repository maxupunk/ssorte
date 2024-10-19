import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { fileURLToPath } from 'url';

// Caminho do arquivo CSV
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputFilePath = path.join(__dirname, 'bilhetes.csv');
const outputFilePath = path.join(__dirname, 'bilhetes_filtrados.csv');

// Função para verificar se as colunas da oitava em diante estão vazias
function hasNonEmptyColumns(row) {
    for (let i = 7; i < row.length; i++) {
        if (row[i].trim() !== '') {
            return true;
        }
    }
    return false;
}

// Ler e filtrar o CSV
const results = [];
fs.createReadStream(inputFilePath)
    .pipe(parse({ delimiter: ',', from_line: 2 }))
    .on('data', (row) => {
        if (hasNonEmptyColumns(row)) {
            results.push(row.join(','));
        }
    })
    .on('end', () => {
        // Escrever o CSV filtrado
        fs.writeFileSync(outputFilePath, results.join('\n'), 'utf8');
        console.log('Arquivo CSV filtrado foi salvo em:', outputFilePath);
    });