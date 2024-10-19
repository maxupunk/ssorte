import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function runScript(scriptPath) {
  const absolutePath = path.resolve(__dirname, scriptPath);
  const child = spawn('node', [absolutePath]);

  child.stdout.on('data', (data) => {
    console.log(`${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

function main() {
  runScript('importDBLaravel.js');
  runScript('importDBNovo.js');
  runScript('importCSV.5.js');
  runScript('importCSV.10.js');
}

main();