const playwright = require('@playwright/test');
const { chromium, firefox } = require('playwright');

async function scrapeUrl(url) {
    const browser = await chromium.launch({
        headless: true
      });
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(url);
      const title = await page.title();
      const paragraphs = await page.$$eval('p', elements => elements.map(el => el.innerText)); // Scrape text = all <p> tags
      console.log(title);
      const source = {"title": title, "pageContent": paragraphs}; 
      await browser.close(); // Ensure the browser is closed after scraping
      return source;
}

module.exports = { scrapeUrl };