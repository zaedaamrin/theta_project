import playwright from '@playwright/test';
import { chromium, firefox } from 'playwright';

async function scrapeUrl(url) {
    const browser = await chromium.launch({
        headless: true
      });
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(url);
      const title = await page.title();
      const paragraphs = await page.$$eval('p', elements => elements.map(el => el.innerText)); // Scrape text from all <p> tags
      console.log(title);
      const source = {"title": title, "pageContent": paragraphs}; 
      await browser.close(); // Ensure the browser is closed after scraping
      return source;
}

export { scrapeUrl };