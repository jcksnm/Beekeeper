const { createGrid, createTwoLetterList } = require('./util/gridUtils');
const scrapeAnswers = require('./scraper/scraper');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function startGame() {
    const answers = await scrapeAnswers();
    let grid = createGrid(answers);
    let twoLetterList = createTwoLetterList(answers);
    let guessedWords = new Set(); 

    console.log("Initial Grid:");
    displayGrid(grid);
    console.log("\nInitial Two-Letter List:");
    displayTwoLetterList(twoLetterList);

    rl.on('line', (input) => {
        const words = input.split(' ').map(word => word.toUpperCase());

        words.forEach(word => {
            if (!guessedWords.has(word)) {
                console.log(`${word} Correct!`);

                const { updatedGrid, updatedTwoLetterList } = updateGridAndTwoLetterList(grid, twoLetterList, word);
                grid = updatedGrid;
                twoLetterList = updatedTwoLetterList;

                guessedWords.add(word);
            }
        });

        console.log("\nUpdated Grid:");
        displayGrid(grid);
        console.log("\nUpdated Two-Letter List:");
        displayTwoLetterList(twoLetterList);
    });
}

function displayGrid(grid) {
    grid.forEach(row => {
        console.log(row.join('\t'));
    });
}

function displayTwoLetterList(twoLetterList) {
    Object.keys(twoLetterList).forEach(letter => {
        const line = twoLetterList[letter]
            .map(item => `${item.combo}-${item.count}`)
            .join(' ');
        console.log(line);
    });
}

function updateGridAndTwoLetterList(grid, twoLetterList, word) {
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
}

startGame();