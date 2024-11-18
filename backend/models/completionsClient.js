const { AzureOpenAI } = require("openai");
require("dotenv/config");

const endpoint =  process.env.ENDPOINT;
const apiKey = process.env.API_KEY;
const apiVersion = process.env.COMPLETION_API_VERSION;
const deployment = process.env.COMPLETION_MODEL_NAME; 

const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment});

module.exports = { client };