import readline from 'node:readline';
import fs from 'node:fs';

const readStream = fs.createReadStream('../input.txt');

const rl = readline.createInterface({ input: readStream });

const isDigit = (char) => /\d/.test(char);

const isGear = (char) => /[*]/.test(char);

/**
 * Find and remove a number from the matrix, starting at the given coordinates
 * @param {String[][]} matrix
 * @param {[number, number]} coord
 * @returns {number} - The value of the extracted number
 */
const extractNumber = (matrix, [rowIndex, colIndex]) => {
    const row = matrix[rowIndex];

    let pos = colIndex;

    while (isDigit(row[pos])) {
        // Walk back until the beginning of the number
        pos -= 1;
    }
    pos += 1;

    let numString = '';

    while (isDigit(row[pos])) {
        // Walk forward capturing each digit in the number
        numString = numString + row[pos];
        row[pos] = void 0; // Remove from the matrix
        pos += 1;
    }

    return Number(numString);
};

/**
 * Build a generator which iterates over all the coordinates which surround a coordinate
 *
 * @param {*[][]} matrix
 * @param {[number, number]} coord
 * @returns {Generator<number[], void, *>}
 */
function* getSurrounding(matrix, [rowIndex, colIndex]) {
    const rowBefore = Math.max(0, rowIndex - 1);
    const rowAfter = Math.min(matrix.length - 1, rowIndex + 1);

    const colBefore = Math.max(0, colIndex - 1);
    const colAfter = Math.min(matrix[colIndex].length, colIndex + 1);

    for (let r = rowBefore; r <= rowAfter; r++) {
        for (let c = colBefore; c <= colAfter; c++) {
            yield [r, c];
        }
    }
}

/**
 * Build a generator which iterates over each coordinate pair in a matrix
 *
 * @param {*[][]} matrix
 * @returns {Generator<number[], void, *>}
 */
function* matrixIter(matrix) {
    for (const [rowIndex, row] of matrix.entries()) {
        for (const [colIndex] of row.entries()) {
            yield [rowIndex, colIndex];
        }
    }
}

const matrix = [];

const lineParser = (line) => {
    const arr = [...line];
    // Build a big matrix of characters
    matrix.push(arr);
};

rl.on('line', lineParser);

rl.on('close', () => {
    const ratios = [];

    for (const [rowIndex, colIndex] of matrixIter(matrix)) {
        if (isGear(matrix[rowIndex][colIndex])) {
            const gears = [];

            // Get the surrounding coordinates
            const surrounding = getSurrounding(matrix, [rowIndex, colIndex]);

            for (const [rowIndex, colIndex] of surrounding) {
                // Look for digits adjacent to a symbol
                if (isDigit(matrix[rowIndex][colIndex])) {
                    // For each digit in the surrounding coords
                    const number = extractNumber(matrix, [rowIndex, colIndex]);
                    gears.push(number);
                }
            }

            if (gears.length === 2) {
                ratios.push(gears[0] * gears[1]);
            }
        }
    }

    console.debug(`Ratios: ${[...ratios]}`);

    // Add up all the part numbers
    const sum = [...ratios].reduce((acc, curr) => acc + curr, 0);
    console.log(`Sum: ${sum}`);
});
