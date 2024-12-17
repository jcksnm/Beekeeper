const express = require('express');
const { createGrid, createTwoLetterList } = require('./util/gridUtils');
const scrapeAnswers = require('./scraper/scraper');
const path = require('path');

const app = express();
const port = 3000;

let grid;
let twoLetterList;
let guessedWords = new Set();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

async function initializeGame() {
    const answers = await scrapeAnswers();
    grid = createGrid(answers);
    twoLetterList = createTwoLetterList(answers);
};

initializeGame().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/start', (req, res) => {
    res.json({
        grid: grid,
        twoLetterList: twoLetterList,
    });
});

app.get('/status', (req, res) => {
    res.json({
        grid: grid,
        twoLetterList: twoLetterList
    });
});

app.post('/submit', (req, res) => {
    const { words } = req.body;
    if (!Array.isArray(words)) {
        return res.status(400).json({ message: 'Words should be an array of strings.' });
    }

    words.forEach(word => {
        const wordUpper = word.toUpperCase();

        if (!guessedWords.has(wordUpper)) {
            const { updatedGrid, updatedTwoLetterList } = updateGridAndTwoLetterList(grid, twoLetterList, wordUpper);
            grid = updatedGrid;
            twoLetterList = updatedTwoLetterList;
            guessedWords.add(wordUpper);
        }
    });

    res.json({
        message: 'Words submitted!',
        grid: grid,
        twoLetterList: twoLetterList
    });
});

function updateGridAndTwoLetterList(grid, twoLetterList, word) {
    const firstLetter = word[0];
    const wordLength = word.length;

    const rowIndex = grid.findIndex(row => row[0] === firstLetter);
    const colIndex = grid[0].indexOf(wordLength);

    if (rowIndex !== -1 && colIndex !== -1) {
        grid[rowIndex][colIndex] = Math.max(grid[rowIndex][colIndex] - 1, 0) || '-';
        grid[grid.length - 1][colIndex] = Math.max(grid[grid.length - 1][colIndex] - 1, 0) || '-';
        grid[rowIndex][grid[0].length - 1] = Math.max(grid[rowIndex][grid[0].length - 1] - 1, 0) || '-';
    }

    let newSum = 0;
    grid[grid.length - 1].forEach((value, idx) => {
        if (idx < grid[0].length - 1) {
            const numValue = Number(value);
            if (!isNaN(numValue)) {
                newSum += numValue;
            }
        }
    });

    grid[grid.length - 1][grid[0].length - 1] = newSum || '-';

    //two-letter list
    const firstTwoLetters = word.substring(0, 2);
    if (twoLetterList[firstLetter]) {
        const index = twoLetterList[firstLetter].findIndex(item => item.combo === firstTwoLetters);
        if (index !== -1) {
            twoLetterList[firstLetter][index].count--;
        }
    }

    return { updatedGrid: grid, updatedTwoLetterList: twoLetterList };
}