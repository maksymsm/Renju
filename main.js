const fs = require('fs');

function readRenjuInput(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().replaceAll('\n\n', '\n').split('\n');

    const testCasesCount = parseInt(lines[0], 10);

    if (testCasesCount < 1 || testCasesCount > 11) {
        throw new Error('Invalid number of test cases. It must be between 1 and 11.');
    }

    let index = 1;
    const testCases = [];

    for (let t = 0; t < testCasesCount; t++) {
        const board = [];
        for (let i = 0; i < 19; i++) {
            const row = lines[index].trim().split(' ').map(Number);
            board.push(row);
            index++;
        }
        testCases.push(board);
    }

    return testCases;
}

function checkWinner(board) {
    for (let i = 0; i < 19; i++) {
        for (let j = 0; j < 19; j++) {
            if (board[i][j] === 0) continue;
            const player = board[i][j];

            // assuming we start from top left, so check only right, down, and diagonal

            // Check right →
            if (j + 4 < 19 && board[i][j + 1] === player && board[i][j + 2] === player &&
                board[i][j + 3] === player && board[i][j + 4] === player) {
                return [player, i + 1, j + 1];
            }

            // Check down ↓
            if (i + 4 < 19 && board[i + 1][j] === player && board[i + 2][j] === player &&
                board[i + 3][j] === player && board[i + 4][j] === player) {
                return [player, i + 1, j + 1];
            }

            // Check diagonal ↘
            if (i + 4 < 19 && j + 4 < 19 && board[i + 1][j + 1] === player && board[i + 2][j + 2] === player &&
                board[i + 3][j + 3] === player && board[i + 4][j + 4] === player) {
                return [player, i + 1, j + 1];
            }
        }
    }
    return [0]; // No winner
}

const filePath = 'input.txt';
const outputFilePath = 'output.txt';
const testCases = readRenjuInput(filePath);

const results = testCases.map(board => {
    const [winner, startX, startY] = checkWinner(board);
    return winner ? `${winner}\n${startX} ${startY}` : 0;
}).join('\n');

fs.writeFileSync(outputFilePath, results);
