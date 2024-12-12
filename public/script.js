console.log("Script loaded")

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3000/status');
        const data = await response.json();

        updateGrid(data.grid);
        updateTwoLetterList(data.twoLetterList);

        document.getElementById('game-area').style.display = 'block';
    } catch (error) {
        console.error("Failed to initialize game:", error);
    }
});

document.getElementById('submit-words').addEventListener('click', async () => {
    try {
        let input = document.getElementById('word-input').value.trim();
        console.log("Raw input:", input);

        input = input.replace(/\n/g, ' ').trim();
        console.log("Processed input:", input);

        if (!input) {
            console.error("Input is empty after replacing newlines and trimming.");
            return;
        }

        const words = input.split(' ').filter(word => word.trim() !== "");
        console.log("Parsed words:", words);

        if (words.length === 0) {
            console.error("No valid words to submit.");
            return;
        }

        document.getElementById('word-input').value = '';

        const response = await fetch('http://localhost:3000/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ words }),
        });

        if (!response.ok) {
            console.error("Failed to submit words. Server response:", response.status, await response.text());
            return;
        }

        const data = await response.json();
        console.log("Server response data:", data);

        updateGrid(data.grid);
        updateTwoLetterList(data.twoLetterList);

        console.log("Submission completed successfully!");
    } catch (error) {
        console.error("An error occurred during submission:", error);
    }
});

function updateGrid(grid) {
    const gridOutput = document.getElementById('grid-output');
    const table = document.createElement('table');
    
    const lastRowIndex = grid.length - 1;
    const lastColumnIndex = grid[0].length - 1;

    grid.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell, cellIndex) => {
            const cellElement = document.createElement(rowIndex === 0 ? 'th' : 'td');
            cellElement.textContent = cell;

            if (rowIndex !== 0 && cellIndex === 0) {
                cellElement.textContent = `${cell}:`;
                cellElement.style.fontWeight = 'bold';
            } else {
                cellElement.textContent = cell;
            }

            if (cellIndex === lastColumnIndex || rowIndex === lastRowIndex) {
                cellElement.style.fontWeight = 'bold';
            }

            tr.appendChild(cellElement);
        });
        table.appendChild(tr);
    });

    gridOutput.innerHTML = '';
    gridOutput.appendChild(table);
}

function updateTwoLetterList(twoLetterList) {
    const twoLetterListOutput = document.getElementById('two-letter-list-output');
    twoLetterListOutput.innerHTML = '';

    Object.keys(twoLetterList).forEach(letter => {
        const line = twoLetterList[letter]
            .map(item => `${item.combo}-${item.count}`)
            .join(' ');

        const div = document.createElement('div');
        div.textContent = line;
        twoLetterListOutput.appendChild(div);
    });
}