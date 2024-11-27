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
    // embeding vector size 1536
    const embeddings = response.data.map(item => item.embedding);
    // Uncomment to check embeddings: console.log("Generated embeddings:", embeddings);


    const binaryEmbeddings = embeddings.map(embedding => 
      Buffer.from(new Float32Array(embedding).buffer)
    );
    // console.log("generated embeddings:", embeddings);
    // console.log("generated binaryEmbeddings:", binaryEmbeddings);
    // console.log("length of embedding:", embeddings[0].length);
    // console.log("length of buffer:", binaryEmbeddings[0].length);
    // console.log("Embedding complete")

    // const originalEmbeddings = binaryEmbeddings.map(binary => {
    //   const arrayBuffer = binary.buffer.slice(binary.byteOffset,binary.byteOffset+binary.byteLength);
    //   return Array.from(new Float32Array(arrayBuffer));
    // })
    // console.log(originalEmbeddings);
    // console.log("length of ", originalEmbeddings[0].length);
    // for(let i = 0; i < originalEmbeddings.length; i++){
    //   if(embeddings[i] === originalEmbeddings[i])
    //     console.log(true);
    //   console.log(false);
    //   console.log(embeddings[i]);
    //   console.log(originalEmbeddings[i]);
    // }

    return binaryEmbeddings;
  } catch (error) {
    console.error("Error generating embeddings:", error.message);
    throw error;
  }
}

module.exports = { scrapeUrl, generateChunks, generateEmbeddings};