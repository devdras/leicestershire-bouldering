import { data } from '../src/data/index';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Go up to scripts, then up to pwa root, then up to project root, then storage/app
const outputPath = path.resolve(__dirname, '../../storage/app/legacy_data.json');

// Ensure directory exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

console.log(`Exporting data to ${outputPath}...`);
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log('Done.');
