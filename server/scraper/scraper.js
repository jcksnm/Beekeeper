const puppeteer = require('puppeteer');

async function scrapeAnswers() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        console.log('Attempting to load page...');
        await page.goto('https://www.sbsolver.com/answers', { timeout: 60000, waitUntil: 'domcontentloaded' });
        await page.waitForSelector('td.bee-hover', { timeout: 60000 });
        console.log('Page loaded successfully.');

        await new Promise(resolve => setTimeout(resolve, 3000));

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