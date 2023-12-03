import readline from 'node:readline';
import fs from 'node:fs';

const readStream = fs.createReadStream('../input.txt');

const rl = readline.createInterface({ input: readStream });

/**
 * Find consecutive sequences in an array.
 *
 * Returns the consecutive sequences as an array.
 *
 * @example
 * findConsecutive([0,1,2,5,6,7]);
 * // -> [[0, 1, 2], [5, 6, 7]]
 *
 *
 * @param {number[]} array
 * @returns {number[][]}
 */
const findConsecutive = (array) => {
    let temp = [];
    let result = [];

    for (let i = 0; i < array.length; i++) {
        const diff = array[i] - array[i + 1];
        if (Math.abs(diff) === 1) {
            temp.push(array[i]);
        } else {
            temp.push(array[i]);
            result.push(temp);
            temp = [];
        }
    }
    return result;
};

const matrix = [];

const lineParser = (line) => {
    const arr = [...line];
    // Build a big matrix of characters
    matrix.push(arr);
};

rl.on('line', lineParser);

rl.on('close', () => {
    const numbers = [];

    for (let row = 0; row < matrix.length; row++) {
        const numberIndexes = [];
        // Find the index of all the digits in the row
        for (let col = 0; col < matrix[row].length; col++) {
            if (/\d/.test(matrix[row][col])) {
                numberIndexes.push(col);
            }
        }

        // Find the indexes of all the digits in the row as separate arrays
        const consecutives = findConsecutive(numberIndexes);

        for (const numberIndexes of consecutives) {
            // Build the number value from the indexes
            const number = Number(
                numberIndexes.map((n) => matrix[row][n]).join('')
            );

            // Indexes to test
            const testIndexes = new Set(numberIndexes);

            // Add the index before and behind each index to test
            for (const idx of numberIndexes) {
                if (idx - 1 >= 0) {
                    testIndexes.add(idx - 1);
                }

                if (idx + 1 < matrix[row].length) {
                    testIndexes.add(idx + 1);
                }
            }

            const prevRow = Math.max(row - 1, 0);
            const nextRow = row + 1 < matrix.length ? row + 1 : row;

            // Match anything except digits, ., or control chars
            const symbolRegex = /[^0-9.\s]/;

            for (const testIndex of testIndexes) {
                // If the regex matches the test index in either this, the previous, or the next row
                if (
                    symbolRegex.test(matrix[prevRow][testIndex]) ||
                    symbolRegex.test(matrix[row][testIndex]) ||
                    symbolRegex.test(matrix[nextRow][testIndex])
                ) {
                    // Found a part number
                    numbers.push(number);
                }
            }
        }
    }

    console.debug(`Part numbers: ${[...numbers]}`);

    // Add up all the part numbers
    const sum = [...numbers].reduce((acc, curr) => acc + curr, 0);
    console.log(`Sum: ${sum}`);
});
