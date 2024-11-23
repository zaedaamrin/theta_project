const { client } = require('../models/completionModel');

async function generateResponse(userMessage) {
    // embed user query first
    // TODO 
    // retrieving chunks and performing cosine similarity 
    getSimilarChunks: async (queryEmbedding) => {
        try {
          const poolConnection = await pool;
      
          // Retrieve all embeddings from Content table
          const result = await poolConnection.request()
            .query('SELECT contentId, contentTextChunk, embedding FROM Content');
      
          const contentData = result.recordset.map(record => ({
            contentId: record.contentId,
            contentTextChunk: record.contentTextChunk,
            embedding: JSON.parse(record.embedding.toString()) // Deserialize
          }));
      
          // implement cosine similarity
          const similarities = contentData.map(content => ({
            contentId: content.contentId,
            contentTextChunk: content.contentTextChunk,
            similarity: calculateCosineSimilarity(queryEmbedding, content.embedding)
          }));
      
          // sort by similarity score (highest first)
          similarities.sort((a, b) => b.similarity - a.similarity);
          return similarities.slice(0, 5); // returning top 5 results
        } catch (err) {
          console.error('Error retrieving embeddings:', err);
          return [];
        }
      }

    try {
        const result = await client.chat.completions.create({
              messages: [
                { role: "system", content: "You are a helpful assistant. You will talk professionally." },
                { role: "user", content: userMessage },
               ],
              model: 'gpt-4',
        });
    
        // To do: refactor the response, if there is a case that the completions object includes multiple choices?
        // const responseMessages = []
        // for (const choice of result.choices) {
        //   responseMessages.push(choice.message)
        //   // console.log(choice.message);
        // }

        const answer = result?.choices[0].message.content
        return answer
    } catch (error) {
          console.error("Error generating repsonse from model:", error);
          throw error
    }
}

const calculateCosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a ** 2, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b ** 2, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  };
  
module.exports = { generateResponse, calculateCosineSimilarity};
