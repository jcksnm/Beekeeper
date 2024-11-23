const puppeteer = require('puppeteer');

async function scrapeGrid() {
    // Launch the browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the target website
    await page.goto('https://www.nytimes.com/2024/11/23/crosswords/spelling-bee-forum.html');

    // Wait for the content to load (adjust the selector as necessary)
    await page.waitForSelector('td.cell');

    // Scrape the answers from the page
    const grid = await page.evaluate(() => {
        // Select all answer elements
        const elements = document.querySelectorAll('td.cell');
        // Extract and return the text content as an array
        //return Array.from(elements).map(el => el.textContent.trim());
        return Array.from(elements).map(el => el.textContent.trim());
    });

    // Print the answers
    //console.log(grid);

    // Close the browser
    await browser.close();
    return grid;
}

//scrapeGrid().catch(console.error);

module.exports = scrapeGrid;
