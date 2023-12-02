import readline from 'node:readline';
import fs from 'node:fs';

const readStream = fs.createReadStream('../input.txt');

const rl = readline.createInterface({ input: readStream });

let total = 0;

const lineParser = (line) => {
    const regex = /[0-9]/g;

    // Find all numbers
    const numbers = line.match(regex);

    // Combine first and last numbers e.g. 1+2 = 12
    const combined = numbers.at(0) + numbers.at(-1);

    // Add numeric value of combined number to total
    total += Number(combined);
};

rl.on('line', lineParser);

rl.on('close', () => {
    console.log(total);
});
