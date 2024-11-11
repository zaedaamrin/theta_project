import playwright from '@playwright/test';
import { chromium, firefox } from 'playwright';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";

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
      const source = {"title": title, "rawData": paragraphs}; 
      await browser.close(); // Ensure the browser is closed after scraping
      return source;
}

async function chunkText(text) {
  // console.log(text);
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 0,
  });
  
  const docOutput = await splitter.splitDocuments([
    new Document({ pageContent: text }),
  ]);

  return docOutput
}

export { scrapeUrl, chunkText };