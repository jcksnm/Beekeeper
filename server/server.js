const express = require('express');
const { createGrid, createTwoLetterList } = require('./util/gridUtils');
const scrapeAnswers = require('./scraper/scraper');
const path = require('path');

const app = express();
const port = 3000;

// Store game state in memory
let grid;
let twoLetterList;
let guessedWords = new Set();

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the correct path
app.use(express.static(path.join(__dirname, '../public'))); // Adjusted path

// Endpoint to start the game
app.get('/start', async (req, res) => {
    const answers = await scrapeAnswers();
    grid = createGrid(answers);
    twoLetterList = createTwoLetterList(answers);

    // Clear the guessed words set
    guessedWords = new Set();

    res.json({
        message: 'Game started!',
        grid: grid,
        twoLetterList: twoLetterList
    });
});

// Endpoint to submit words
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

// Endpoint to get the current grid and two-letter list
app.get('/status', (req, res) => {
    res.json({
        grid: grid,
        twoLetterList: twoLetterList
    });
});

// Utility to update grid and two-letter list
/* function updateGridAndTwoLetterList(grid, twoLetterList, word) {
    const firstLetter = word[0];
    const wordLength = word.length;

    const rowIndex = grid.findIndex(row => row[0] === firstLetter);
    const colIndex = grid[0].indexOf(wordLength);

    if (rowIndex !== -1 && colIndex !== -1) {
        grid[rowIndex][colIndex]--;
        grid[grid.length - 1][colIndex]--;
        grid[rowIndex][grid[0].length - 1]--;
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

    grid[grid.length - 1][grid[0].length - 1] = newSum;

    const firstTwoLetters = word.substring(0, 2);
    if (twoLetterList[firstLetter]) {
        const index = twoLetterList[firstLetter].findIndex(item => item.combo === firstTwoLetters);
        if (index !== -1) {
            twoLetterList[firstLetter][index].count--;
        }
    }

    return { updatedGrid: grid, updatedTwoLetterList: twoLetterList };
} */


function updateGridAndTwoLetterList(grid, twoLetterList, word) {
    const firstLetter = word[0];
    const wordLength = word.length;

    const rowIndex = grid.findIndex(row => row[0] === firstLetter);
    const colIndex = grid[0].indexOf(wordLength);

    if (rowIndex !== -1 && colIndex !== -1) {
        // Decrement cell value and replace 0 with '-'
        grid[rowIndex][colIndex] = Math.max(grid[rowIndex][colIndex] - 1, 0) || '-';
        grid[grid.length - 1][colIndex] = Math.max(grid[grid.length - 1][colIndex] - 1, 0) || '-';
        grid[rowIndex][grid[0].length - 1] = Math.max(grid[rowIndex][grid[0].length - 1] - 1, 0) || '-';
    }

    // Update total sum at the bottom-right
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

    // Update two-letter list
    const firstTwoLetters = word.substring(0, 2);
    if (twoLetterList[firstLetter]) {
        const index = twoLetterList[firstLetter].findIndex(item => item.combo === firstTwoLetters);
        if (index !== -1) {
            twoLetterList[firstLetter][index].count--;
        }
    }

    return { updatedGrid: grid, updatedTwoLetterList: twoLetterList };
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});