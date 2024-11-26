const puppeteer = require('puppeteer');

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

module.exports = scrapeAnswers;