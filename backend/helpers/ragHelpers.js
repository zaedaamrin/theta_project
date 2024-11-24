const { pool } = require('../database.js');
const { generateEmbeddings } = require('./sourcesHelpers.js');
// Import OpenAI SDK
const { OpenAI } = require('openai');
const openai = new OpenAI({
  apiKey: 'enter-openai-api-key'
});

const calculateCosineSimilarity = (vecA, vecB) => {
    // converting Buffer or Float32Array to a regular array
    if (Buffer.isBuffer(vecA)) {
        vecA = Array.from(new Float32Array(vecA));
    } else if (vecA instanceof Float32Array) {
        vecA = Array.from(vecA);
    }

    if (Buffer.isBuffer(vecB)) {
        vecB = Array.from(new Float32Array(vecB));
    } else if (vecB instanceof Float32Array) {
        vecB = Array.from(vecB); 
    }

    // ensuring both vectors are regular arrays
    if (!Array.isArray(vecA) || !Array.isArray(vecB)) {
        console.error('One or both vectors are not arrays:', vecA, vecB);
        return 0; // Or handle the error in another way
    }

    // checking if either vector has a zero magnitude
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a ** 2, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b ** 2, 0));

    if (magnitudeA === 0 || magnitudeB === 0) {
        console.warn('One or both vectors are zero vectors:', vecA, vecB);
        return 0;
    }

    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
    return dotProduct / (magnitudeA * magnitudeB);
};

// retrieving top 5 chunks from the db using cosine similarity
async function getSimilarChunks(queryEmbedding) {
    try {
        console.log('Query Embedding:', queryEmbedding); 
        const poolConnection = await pool;

        // retrieve all embeddings and chunks from the Content table
        console.log('Retrieving embeddings and chunks from the Content table...');
        const result = await poolConnection.request()
            .query('SELECT contentId, contentTextChunk, embedding FROM Content');

        console.log('Database returned records:', result.recordset.length); 
        const contentData = result.recordset.map(record => ({
            contentId: record.contentId,
            contentTextChunk: record.contentTextChunk,
            embedding: new Float32Array(JSON.parse(record.embedding.toString()))
        }));

        // calculate cosine similarity for each chunk
        console.log('Calculating cosine similarity for each chunk...');
        const similarities = contentData.map(content => ({
            contentId: content.contentId,
            contentTextChunk: content.contentTextChunk,
            similarity: calculateCosineSimilarity(queryEmbedding, content.embedding),
        }));

        // sorting by similarity score and return the top 5 results
        similarities.sort((a, b) => b.similarity - a.similarity);
        console.log('Top 5 similar chunks:', similarities.slice(0, 5));
        return similarities.slice(0, 5);
    } catch (err) {
        console.error('Error retrieving similar chunks:', err.message);
        return [];
    }
}

// create response using userMessage
async function generateResponse(userMessage) {
    try {
      console.log('Step 1: Generating embeddings for user query...');
      const queryEmbedding = await generateEmbeddings([userMessage]);
      const queryEmbeddingArray = queryEmbedding.map(buffer => new Float32Array(buffer)); 
  
      console.log('Generated query embedding:', queryEmbeddingArray);
  
      // retrieve similar chunks from the database
      const similarChunks = await getSimilarChunks(queryEmbeddingArray[0]); // Pass the first embedding
  
      // create context from similar chunks
      const context = similarChunks.map(chunk => chunk.contentTextChunk).join('\n');
      console.log('Generated context for response:', context);
  
      // send request to openai api
      const result = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a helpful assistant. Use the provided context to answer professionally.' },
          { role: 'user', content: `Context: ${context}\n\nQuestion: ${userMessage}` },
        ],
        model: 'gpt-4',
      });
  
      const answer = result?.choices[0]?.message?.content || 'No response generated.';
      console.log('Generated response from OpenAI:', answer);
      return answer;
    } catch (error) {
      console.error('Error generating response:', error.message);
      throw error;
    }
}

module.exports = { generateResponse };
