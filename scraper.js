const puppeteer = require('puppeteer');

async function scrapeAnswers() {
    // Launch the browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the target website
    await page.goto('https://www.sbsolver.com/answers');

    // Wait for the content to load (adjust the selector as necessary)
    await page.waitForSelector('td.bee-hover');

    // Scrape the answers from the page
    const answers = await page.evaluate(() => {
        // Select all answer elements
        const elements = document.querySelectorAll('td.bee-hover');
        // Extract and return the text content as an array
        return Array.from(elements).map(el => el.textContent.trim());
    });

    const answers_length = answers.map(word => ({
        word: word,
        length: word.length,
    }))

    // Print the answers
    console.log('Extracted Answers:', answers);
    console.log(answers_length)

    // Close the browser
    await browser.close();
    return answers_length;
}

//scrapeAnswers().catch(console.error);

module.exports = scrapeAnswers;