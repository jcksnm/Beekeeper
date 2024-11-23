const scrapeAnswers = require('./scraper')

async function getAnswers() {
    try {
        const answers = await scrapeAnswers(); // Call the scraper function
        //console.log('Answers:', answers);
        return answers;
    } catch (error) {
        console.error('Error creating grid:', error);
    }
}

function createGrid(answers) {
    let letterLengthCount = {};

    // Populate letterLengthCount with counts of words for each letter and length
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

    // Determine the max length and the possible lengths (4, 5, 6, etc.)
    const maxLength = answers.reduce((max, obj) => Math.max(max, obj.length), 0);
    const lengths = Array.from({ length: maxLength - 4 + 1 }, (_, index) => 4 + index);

    // Get unique first letters from answers (used for row names)
    const rows = [''].concat([...new Set(answers.map(obj => obj.word[0]))].sort()).concat('Σ');

    // Columns include lengths and a final "Σ" column
    const columns = ['', ...lengths, 'Σ'];

    // Create the grid
    let grid = [];
    let totalWords = 0;

    // Populate the grid with word counts
    rows.forEach((row, rowIndex) => {
        grid[rowIndex] = [];

        if (row === '') {
            // Fill the first row (header row) with columns
            grid[rowIndex] = [...columns];
        } else if (row === 'Σ') {
            // For Σ row, we will sum the columns
            let sumRow = ['Σ'];
            lengths.forEach(length => {
                let columnTotal = 0;
                rows.forEach((r) => {
                    if (r !== 'Σ') {
                        columnTotal += letterLengthCount[r] ? letterLengthCount[r][length] || 0 : 0;
                    }
                });
                sumRow.push(columnTotal);
            });
            sumRow.push(totalWords);  // Total words across all rows
            grid.push(sumRow);
        } else {
            // For each letter, fill the corresponding row
            let rowTotal = 0;

            // First, push the letter label (row label) into the first column
            grid[rowIndex].push(row);

            lengths.forEach(length => {
                let count = letterLengthCount[row] ? letterLengthCount[row][length] || 0 : 0;
                grid[rowIndex].push(count); // Add count in the correct column
                rowTotal += count;
            });

            // Add the sum for the "Σ" column (row total)
            grid[rowIndex].push(rowTotal);
            totalWords += rowTotal;
        }
    });

    // Output the grid for inspection
    console.log("Generated Grid:");
    // Print all rows except the last row first
    grid.slice(0, -1).forEach(row => {
        console.log(row.join('\t'));
    });

    // Print the last row without adding extra space
    console.log(grid[grid.length - 1].join('\t'));
}

function createTwoLetterList(answers) {
    let groupedByFirstLetter = {};

    // Loop through each word in answers
    answers.forEach(answer => {
        const word = answer.word;
        if (word.length >= 2) {
            const firstTwoLetters = word.substring(0, 2); // Get the first two letters
            const firstLetter = firstTwoLetters[0]; // Get the first letter of the combination

            // Group by first letter
            if (!groupedByFirstLetter[firstLetter]) {
                groupedByFirstLetter[firstLetter] = [];
            }

            // Add the two-letter combination to the group, and update its count
            let existing = groupedByFirstLetter[firstLetter].find(item => item.combo === firstTwoLetters);
            if (existing) {
                existing.count++;
            } else {
                groupedByFirstLetter[firstLetter].push({ combo: firstTwoLetters, count: 1 });
            }
        }
    });

    // Print the results, grouped by the first letter
    Object.keys(groupedByFirstLetter).forEach(letter => {
        let line = groupedByFirstLetter[letter]
            .map(item => `${item.combo}-${item.count}`)
            .join(' '); // Join the two-letter combos on the same line
        console.log(line);
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
    const twoLetterList = createTwoLetterList(answers);
})
