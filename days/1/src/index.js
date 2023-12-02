import readline from 'node:readline';
import fs from 'node:fs';

const numberMap = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
};

const readStream = fs.createReadStream('../input.txt');

const rl = readline.createInterface({ input: readStream });

let total = 0;

const lineParser = (line) => {
    // Regex matching digits or number strings
    const numbersString = Object.keys(numberMap).join('|');
    const regex = new RegExp(`(?=([0-9]|${numbersString}))`, 'g');

    // Get a match iterator
    const matcher = line.matchAll(regex);

    const matches = [];
    for (const y of matcher) {
        matches.push(y[1]);
    }

    // Convert
    const numbers = matches.map((number) => numberMap[number] ?? number);

    // Combine first and last numbers e.g. 1+2 = 12
    const combined = `${numbers.at(0)}${numbers.at(-1)}`;

    // Add numeric value of combined number to total
    total += Number(combined);
};

rl.on('line', lineParser);

rl.on('close', () => {
    console.log(total);
});
