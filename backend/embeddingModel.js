const { AzureOpenAI } = require("openai");
require("dotenv/config");

const endpoint =  process.env.ENDPOINT;
const apiKey = process.env.API_KEY;
const apiVersion = process.env.EMBEDDING_API_VERSION;
const deployment = process.env.EMBEDDING_MODEL_NAME;  

const embeddingModel = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment});

module.exports = { embeddingModel };