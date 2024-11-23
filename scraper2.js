const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.nytimes.com/2024/11/22/crosswords/spelling-bee-forum.html', { waitUntil: 'networkidle2' });

    const selectors = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        return Array.from(elements).map(el => {
            const tag = el.tagName.toLowerCase();
            const id = el.id ? `#${el.id}` : '';
            const classes = typeof el.className === 'string' 
                ? `.${el.className.trim().replace(/\s+/g, '.')}` 
                : '';
            return `${tag}${id}${classes}`;
        });
    });

    fs.writeFileSync('selectors2.txt', [...new Set(selectors)].join('\n'));
    console.log('Selectors saved to selectors2.txt');

    await browser.close();
})();