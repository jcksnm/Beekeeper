const grid = require('./scrapeGrid.js');
console.log(grid)

async function transformGrid() {
    try {
        const grid = await scrapeGrid(); 
        console.log('Grid:', grid);

    } catch (error) {
        console.error('Error creating grid:', error);
    }
}

transformGrid()