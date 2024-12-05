/* const puppeteer = require('puppeteer');

async function scrapeAnswers() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.sbsolver.com/answers');
    await page.waitForSelector('td.bee-hover');

    const answers = await page.evaluate(() => {
        const elements = document.querySelectorAll('td.bee-hover');
        return Array.from(elements).map(el => el.textContent.trim());
    });

    const answersLength = answers.map(word => ({
        word: word,
        length: word.length,
    }));

    await browser.close();
    return answersLength;
}

module.exports = scrapeAnswers; */

const puppeteer = require('puppeteer');

async function scrapeAnswers() {
    //const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }); // Launch with more options
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // Set a custom user-agent to mimic a real browser
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        console.log('Attempting to load page...');
        await page.goto('https://www.sbsolver.com/answers', { timeout: 60000, waitUntil: 'domcontentloaded' }); // More reliable wait condition
        await page.waitForSelector('td.bee-hover', { timeout: 60000 }); // Wait for the grid to load
        console.log('Page loaded successfully.');

        // Custom wait (for older Puppeteer versions)
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds for debugging

        const answers = await page.evaluate(() => {
            const elements = document.querySelectorAll('td.bee-hover');
            return Array.from(elements).map(el => el.textContent.trim());
        });

        const answersLength = answers.map(word => ({
            word: word,
            length: word.length,
        }));

        console.log(`Scraped ${answers.length} answers.`);
        return answersLength;
    } catch (error) {
        console.error('Error scraping answers:', error);
        return [];  // Return an empty array if scraping fails
    } finally {
        await browser.close();
    }
}

module.exports = scrapeAnswers;