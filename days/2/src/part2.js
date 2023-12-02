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
            scores[gameId][colour] = Math.max(
                scores[gameId][colour] ?? 0,
                Number(count)
            );
        }
    }
};

rl.on('line', lineParser);

rl.on('close', () => {
    let totalPower = 0;

    for (const [gameId, colours] of Object.entries(scores)) {
        const power = colours['red'] * colours['blue'] * colours['green'];

        totalPower += power;
    }

    console.log(scores);

    console.log(totalPower);
});
