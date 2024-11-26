const scrapeAnswers = require('../scraper/scraper');

async function getAnswers() {
    try {
        return await scrapeAnswers();
    } catch (error) {
        console.error('Error creating grid:', error);
    }
}

function createGrid(answers) {
    let letterLengthCount = {};
    answers.forEach(answer => {
        const firstLetter = answer.word[0];
        const length = answer.length;

        if (!letterLengthCount[firstLetter]) {
            letterLengthCount[firstLetter] = {};
        }
        if (!letterLengthCount[firstLetter][length]) {
            letterLengthCount[firstLetter][length] = 0;
        }
        letterLengthCount[firstLetter][length]++;
    });

    const validLengths = [...new Set(answers.map(answer => answer.length))].sort((a, b) => a - b);
    const rows = [''].concat([...new Set(answers.map(answer => answer.word[0]))].sort()).concat('Σ');
    const columns = ['', ...validLengths, 'Σ'];
    let grid = [];
    let totalWords = 0;

    rows.forEach((row, rowIndex) => {
        grid[rowIndex] = [];

        if (row === '') {
            grid[rowIndex] = [...columns];
        } else if (row === 'Σ') {
            let sumRow = ['Σ'];
            validLengths.forEach(length => {
                let columnTotal = 0;
                rows.forEach((row) => {
                    if (row !== '' && row !== 'Σ') {
                        columnTotal += letterLengthCount[row]?.[length] || 0;
                    }
                });
                sumRow.push(columnTotal);
            });
            sumRow.push(totalWords);
            grid[rowIndex] = sumRow;
        } else {
            grid[rowIndex].push(row);
            let rowTotal = 0;

            validLengths.forEach(length => {
                let count = letterLengthCount[row]?.[length] || 0;
                grid[rowIndex].push(count);
                rowTotal += count;
            });

            grid[rowIndex].push(rowTotal);
            totalWords += rowTotal;
        }
    });
    return grid;
}

function createTwoLetterList(answers) {
    let groupedByFirstLetter = {};

    answers.forEach(answer => {
        const word = answer.word;
        if (word.length >= 2) {
            const firstTwoLetters = word.substring(0, 2);
            const firstLetter = firstTwoLetters[0];

            if (!groupedByFirstLetter[firstLetter]) {
                groupedByFirstLetter[firstLetter] = [];
            }

            let existing = groupedByFirstLetter[firstLetter].find(item => item.combo === firstTwoLetters);
            if (existing) {
                existing.count++;
            } else {
                groupedByFirstLetter[firstLetter].push({ combo: firstTwoLetters, count: 1 });
            }
        }
    });
    return groupedByFirstLetter;
}

module.exports = {createGrid, createTwoLetterList}