const scrapeAnswers = require('./scraper')

async function getAnswers() {
    try {
        const answers = await scrapeAnswers(); // Call the scraper function
        console.log('Answers:', answers);
        return answers;
    } catch (error) {
        console.error('Error creating grid:', error);
    }
}

function createGrid2(answers){
    const maxLength = answers.reduce((max, obj) => Math.max(max, obj.length), 0);
    //const columns = [''].concat(4, maxLength);
    //const columns = [''].concat(Array.from({ length: maxLength - 4 + 1 }, (_, index) => 4 + index)).concat['Σ'];
    /* const columns = [''].concat(Array.from({ length: maxLength - 4 + 1 }, (_, index) => 4 + index)).concat('Σ');
    const rows = [''].concat([...new Set(answers.map(obj => obj.word[0]))].sort()).concat('Σ'); */
    /* console.log("Columns", columns);
    console.log("Rows", rows); */

    /* const grid = [];
    grid.push(columns);
    rows.forEach(row => {
        const newRow = Array(columns.length).fill(''); // Start with blank cells
        newRow[0] = row; // Set the first cell of the row
        grid.push(newRow);
    });
    grid.forEach(row => {
        console.log(row.join('\t'));
    }); */
    // Create an array to track word counts by starting letter and length
    let letterLengthCount = {};

// Iterate through the answers to build the count data
    answers.forEach(answer => {
        const firstLetter = answer.word[0];
        const length = answer.length;
  
  // Initialize nested object if necessary
    if (!letterLengthCount[firstLetter]) {
        letterLengthCount[firstLetter] = {};
    }
    if (!letterLengthCount[firstLetter][length]) {
        letterLengthCount[firstLetter][length] = 0;
    }

  // Increment the count for the current letter and length
    letterLengthCount[firstLetter][length]++;
    });

// Create arrays for rows and columns
    //const rows = ['', ...Object.keys(letterLengthCount).sort()];
    //const lengths = [4, 5, 6, 7, 8]; // Possible lengths
    const lengths = (Array.from({ length: maxLength - 4 + 1 }, (_, index) => 4 + index));
    const rows = [''].concat([...new Set(answers.map(obj => obj.word[0]))].sort()).concat('Σ');
    const columns = ['', ...lengths, 'Σ'];

    // Create the grid
    let grid = [];
    let totalWords = 0;

    // Populate the grid
    rows.forEach((row, rowIndex) => {
    grid[rowIndex] = [];
  
    if (row === '') {
        // Fill first row (header row)
        grid[rowIndex] = [...columns];
    } else {
        // For each letter, fill the corresponding row
        let rowTotal = 0;

        lengths.forEach(length => {
            let count = letterLengthCount[row] ? letterLengthCount[row][length] || 0 : 0;
            grid[rowIndex].push(count);
            rowTotal += count;
        });

        // Add the sum for the "Σ" column (row total)
        grid[rowIndex].push(rowTotal);
        totalWords += rowTotal;
        }
    });

// Fill the last row (Σ) with column totals
    let sumRow = ['Σ'];
    lengths.forEach(length => {
        let columnTotal = 0;
        rows.forEach((row) => {
            columnTotal += letterLengthCount[row] ? letterLengthCount[row][length] || 0 : 0;
        });
        sumRow.push(columnTotal);
    });
    sumRow.push(totalWords);
    grid.push(sumRow);

// Output the grid
    grid.forEach(row => {
        console.log(row.join('\t'));
    });
}
     



//getAnswers()

/* getAnswers().then(grid => {
    const grid = createGrid(answers);
    grid.forEach(row => {
        console.log(row.join('\t')); // Tab-delimited output
    });
}); */

getAnswers().then(answers => {
    const gridResult = createGrid(answers);
})
