import path from 'path';
import { exec } from 'child_process';

// Função para executar um script
function executeScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(__dirname, scriptPath);
    exec(`node ${absolutePath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar o script ${absolutePath}:`, stderr);
        reject(error);
      } else {
        console.log(`Saída do script ${absolutePath}:`, stdout);
        resolve();
      }
    });
  });
}

// Função para executar uma lista de scripts em ordem
async function runScriptsInOrder(scripts) {
  for (const script of scripts) {
    try {
      await executeScript(script);
    } catch (error) {
      console.error(`Execução interrompida devido a erro no script ${script}`);
      break;
    }
  }
}

// Lista de scripts a serem executados
const scripts = [
  'importDBLaravel.js',
  'importCSV.js',
];

// Executar os scripts em ordem
runScriptsInOrder(scripts);