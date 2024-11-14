const { chromium, firefox } = require('playwright');
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { Document } = require("langchain/document");
const { embeddingModel } = require('../embeddingModel.js');

async function scrapeUrl(url) {
    const browser = await chromium.launch({
        headless: true
      });
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(url);
      const title = await page.title();
      const paragraphs = await page.$$eval('p', elements => elements.map(el => el.innerText)); // Scrape text from all <p> tags
      const source = {"title": title, "rawData": paragraphs}; 
      await browser.close(); 
      console.log("Scraping complete")
      return source;
}

async function generateChunks(text) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 0,
  });
  
  const docOutput = await splitter.splitDocuments([
    new Document({ pageContent: text }),
  ]);

  const chunkArray = docOutput.map(chunk => chunk.pageContent)

  console.log("Chunking complete")
  return chunkArray
}

async function generateEmbeddings(chunks) {
  try {
    // Sending multiple chunks in a single request for efficiency
    const response = await embeddingModel.embeddings.create({
      model: 'text-embedding-3-small',
      input: chunks,
    });

    const embeddings = response.data.map(item => item.embedding);
    // Uncomment to check embeddings: console.log("Generated embeddings:", embeddings);

    console.log("Embedding complete")
    return embeddings;
  } catch (error) {
    console.error("Error generating embeddings:", error.message);
    throw error;
  }
}

module.exports = { scrapeUrl, generateChunks, generateEmbeddings };