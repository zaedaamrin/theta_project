const { pool } = require('../database.js'); 
const { generateEmbeddings } = require('./sourcesHelpers.js'); 

// Helper to calculate cosine similarity
const calculateCosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a ** 2, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b ** 2, 0));
    return dotProduct / (magnitudeA * magnitudeB);
};

// retrieving top 5 chunks from the database using cosine similarity
async function getSimilarChunks(queryEmbedding) {
    try {
        const poolConnection = await pool;

        // Retrieve all embeddings and chunks from the Content table
        const result = await poolConnection.request()
            .query('SELECT contentId, contentTextChunk, embedding FROM Content');

        const contentData = result.recordset.map(record => ({
            contentId: record.contentId,
            contentTextChunk: record.contentTextChunk,
            embedding: JSON.parse(record.embedding.toString()), // Deserialize binary data
        }));

        // Calculate cosine similarity for each chunk
        const similarities = contentData.map(content => ({
            contentId: content.contentId,
            contentTextChunk: content.contentTextChunk,
            similarity: calculateCosineSimilarity(queryEmbedding, content.embedding),
        }));

        // Sort by similarity score and return the top 5 results
        similarities.sort((a, b) => b.similarity - a.similarity);
        return similarities.slice(0, 5);
    } catch (err) {
        console.error('Error retrieving similar chunks:', err.message);
        return [];
    }
}

// Generate a response using userMessage
async function generateResponse(userMessage) {
    try {
        console.log('Generating embeddings for user query...');
        const queryEmbedding = await generateEmbeddings([userMessage]); // Using generateEmbeddings from sourcesHelpers.js

        console.log('Retrieving top similar chunks from database...');
        const similarChunks = await getSimilarChunks(queryEmbedding[0]);

        // Create context from the top chunks
        const context = similarChunks.map(chunk => chunk.contentTextChunk).join('\n');

        console.log('Sending query with context to OpenAI...');
        const result = await client.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a helpful assistant. Use the provided context to answer professionally.' },
                { role: 'user', content: `Context: ${context}\n\nQuestion: ${userMessage}` },
            ],
            model: 'gpt-4',
        });

        const answer = result?.choices[0]?.message?.content || 'No response generated.';
        return answer;
    } catch (error) {
        console.error('Error generating response:', error.message);
        throw error;
    }
}

module.exports = { generateResponse, getSimilarChunks, calculateCosineSimilarity };
