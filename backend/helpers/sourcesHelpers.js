const { chromium, firefox } = require('playwright');
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { Document } = require("langchain/document");
const { embeddingModel } = require('../models/embeddingModel');
// const { embeddingModel } = require('../embeddingModel.js');

async function scrapeUrl(url) {
  if (!url || typeof url !== 'string') {
      throw new Error(`Invalid URL passed to scrapeUrl: ${url}`);
  }

  const browser = await chromium.launch({
      headless: true
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      const title = await page.title();
      const paragraphs = await page.$$eval('p', elements => elements.map(el => el.innerText));
      const paragraphsCombined = paragraphs.join();
      const source = { title, rawData: paragraphsCombined };
      return source;
  } catch (error) {
      console.error('Error during page scraping:', error);
      throw new Error('Failed to scrape the provided URL');
  } finally {
      await browser.close(); // Always close the browser, even if an error occurs
  }
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

  return chunkArray;
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


    const binaryEmbeddings = embeddings.map(embedding => 
      Buffer.from(new Float32Array(embedding).buffer)
    );

    console.log("Embedding complete")

    return binaryEmbeddings;
  } catch (error) {
    console.error("Error generating embeddings:", error.message);
    throw error;
  }
}

const calculateCosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a ** 2, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b ** 2, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

module.exports = { scrapeUrl, generateChunks, generateEmbeddings, calculateCosineSimilarity };