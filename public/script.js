console.log("Script loaded");

document.getElementById('start-game').addEventListener('click', async () => {
    const response = await fetch('http://localhost:3000/start');
    const data = await response.json();
    updateGrid(data.grid);
    updateTwoLetterList(data.twoLetterList);
    document.getElementById('game-area').style.display = 'block';
});

document.getElementById('submit-words').addEventListener('click', async () => {
    const input = document.getElementById('word-input').value.trim();
    if (!input) return;

    const words = input.split(' ');

    const response = await fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words })
    });

    const data = await response.json();
    updateGrid(data.grid);
    updateTwoLetterList(data.twoLetterList);
    document.getElementById('word-input').value = '';
});

function updateGrid(grid) {
    const gridOutput = document.getElementById('grid-output');
    const table = document.createElement('table');
    table.style.border = '1px solid black';
    table.style.borderCollapse = 'collapse';

    const headerRow = document.createElement('tr');
    grid[0].forEach(cell => {
        const th = document.createElement('th');
        th.style.border = '1px solid black';
        th.style.padding = '5px';
        th.textContent = cell;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    grid.slice(1).forEach(row => {
        const dataRow = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.style.border = '1px solid black';
            td.style.padding = '5px';
            td.textContent = cell;
            dataRow.appendChild(td);
        });
        table.appendChild(dataRow);
    });

    gridOutput.innerHTML = '';
    gridOutput.appendChild(table);
}

function updateTwoLetterList(twoLetterList) {
    const twoLetterOutput = document.getElementById('two-letter-output');
    const formattedList = Object.entries(twoLetterList)
        .map(([letter, combos]) => 
            combos.map(({ combo, count }) => `${combo}-${count}`).join(' ')
        )
        .join('\n');
    twoLetterOutput.textContent = formattedList;
}