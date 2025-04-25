const fs = require('fs');

const MIN_TEST_CASES_COUNT = 1;
const MAX_TEST_CASES_COUNT = 11;
const BOARD_SIZE = 19;
const COMBINATION_COMPLETION_LENGTH = 4;

function readRenjuInput(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    let content;
    try {
        content = fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
        throw new Error(`Failed to read file: ${err.message}`);
    }

    const lines = content.trim().replaceAll('\n\n', '\n').split('\n');

    const testCasesCount = parseInt(lines[0], 10);

    if (isNaN(testCasesCount) || testCasesCount < MIN_TEST_CASES_COUNT || testCasesCount > MAX_TEST_CASES_COUNT) {
        throw new Error(`Invalid number of test cases. It must be between ${MIN_TEST_CASES_COUNT} and ${MAX_TEST_CASES_COUNT}.`);
    }

    let index = 1;
    const testCases = [];

    for (let t = 0; t < testCasesCount; t++) {
        const board = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            const row = lines[index].trim().split(' ').map(Number);


            if (row.length !== BOARD_SIZE || row.some(cell => isNaN(cell) || ![0, 1, 2].includes(cell))) {
                throw new Error(`Invalid row at test case ${t + 1}, row ${i + 1}`);
            }

            board.push(row);
            index++;
        }
        testCases.push(board);
    }

    return testCases;
}

function checkRight(board, i, j, player) {
    if (j + COMBINATION_COMPLETION_LENGTH >= BOARD_SIZE) return false;
    for (let k = 1; k <= COMBINATION_COMPLETION_LENGTH; k++) {
        if (board[i][j + k] !== player) return false;
    }
    return true;
}

function checkDown(board, i, j, player) {
    if (i + COMBINATION_COMPLETION_LENGTH >= BOARD_SIZE) return false;
    for (let k = 1; k <= COMBINATION_COMPLETION_LENGTH; k++) {
        if (board[i + k][j] !== player) return false;
    }
    return true;
}

function checkDiagonal(board, i, j, player) {
    if (i + COMBINATION_COMPLETION_LENGTH >= BOARD_SIZE || j + COMBINATION_COMPLETION_LENGTH >= BOARD_SIZE) return false;
    for (let k = 1; k <= COMBINATION_COMPLETION_LENGTH; k++) {
        if (board[i + k][j + k] !== player) return false;
    }
    return true;
}

function checkAntiDiagonal(board, i, j, player) {
    if (i + COMBINATION_COMPLETION_LENGTH >= BOARD_SIZE || j - COMBINATION_COMPLETION_LENGTH < 0) return false;
    for (let k = 1; k <= COMBINATION_COMPLETION_LENGTH; k++) {
        if (board[i + k][j - k] !== player) return false;
    }
    return true;
}

function checkWinner(board) {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === 0) continue;
            const player = board[i][j];

            if (checkRight(board, i, j, player) ||
                checkDown(board, i, j, player) ||
                checkDiagonal(board, i, j, player) ||
                checkAntiDiagonal(board, i, j, player)
            ) {
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
