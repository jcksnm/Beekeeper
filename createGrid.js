const scrapeGrid = require('./scrapeGrid');

async function createGrid2() {
    try {
        const grid = await scrapeGrid(); // Call the scraper function
        console.log('Grid:', grid);
        return grid;
    } catch (error) {
        console.error('Error creating grid:', error);
    }
}

function transformGrid(data) {
    // Step 1: Extract column headers (the 7 elements after the first empty string)
    const columns = [''].concat(data.slice(1, 8)); // Extract the first 7 elements after the initial empty string
    
    // Step 2: Define an empty array for the result
    const result = [];
    
    // Step 3: Extract rows (starting from index 8)
    let rowIndex = 8;
    const rows = [];
    
    // Collect rows until the special row Σ
    while (rowIndex < data.length && !data[rowIndex].includes('Σ:')) {
        // Get the label (e.g., 'a:', 'b:', etc.)
        const rowLabel = data[rowIndex];
        
        // Get the 7 values for this row (next 7 elements)
        const rowData = data.slice(rowIndex + 1, rowIndex + 8);
        
        // Add this row label and its values to the rows array
        rows.push([rowLabel, ...rowData]);
        
        // Move to the next row (skip 8 elements)
        rowIndex += 8;
    }
    
    // Handle the Σ row separately, which starts after rowIndex
    const sumRowLabel = data[rowIndex];  // This will be Σ:
    const sumRowData = data.slice(rowIndex + 1);  // Everything after Σ: is part of this row
    
    // Add the Σ row to the rows array
    rows.push([sumRowLabel, ...sumRowData]);

    // Step 4: Combine columns and rows into the result array
    result.push(columns);  // Add columns as the first row
    result.push(...rows);  // Add all rows

    return result;
}





createGrid2().then(grid => {
    const transformedGrid = transformGrid(grid);
    transformedGrid.forEach(row => {
        console.log(row.join('\t')); // Tab-delimited output
    });
});

