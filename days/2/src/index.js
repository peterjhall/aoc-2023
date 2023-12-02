import readline from 'node:readline';
import fs from 'node:fs';

const readStream = fs.createReadStream('../input.txt');

const rl = readline.createInterface({ input: readStream });

const scores = {};

const lineParser = (line) => {
    const [prefix, gameData] = line.split(':');

    const gameId = prefix.split(' ')[1];
    scores[gameId] = {};

    const games = gameData.split(';');

    for (const game of games) {
        const parts = game.split(',');

        for (const part of parts) {
            const [count, colour] = part.trim().split(' ');
            scores[gameId][colour] = [...(scores[gameId][colour] ?? []), count];
        }
    }
};

rl.on('line', lineParser);

rl.on('close', () => {
    const limits = { red: 12, green: 13, blue: 14 };

    const legalGames = new Set();

    for (const [gameId, colours] of Object.entries(scores)) {
        let legal = true;

        for (const [colour, counts] of Object.entries(colours)) {
            for (const count of counts) {
                if (count > limits[colour]) {
                    legal = false;
                }
            }
        }

        legal && legalGames.add(Number(gameId));
    }

    console.log(scores);

    console.log(legalGames);

    console.log([...legalGames].reduce((acc, curr) => acc + curr, 0));
});
