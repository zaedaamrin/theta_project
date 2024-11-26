const { pool } = require('../database.js');
const { generateEmbeddings } = require('./sourcesHelpers.js');
const { client } = require('../models/completionModel');

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
        // console.error('vectors are not arrays', vecA, vecB);
        return 0; // Or handle the error in another way
    }
    if(vecA.length !== vecB.length){
      console.error('Vector dimensions do not match:', vecA.length, vecB.length);
    }

    // checking if either vector has a zero magnitude
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a ** 2, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b ** 2, 0));
    // console.log('embedding A', vecA);
    // console.log('embedding B', vecB);
    // console.log('Magnitude A', magnitudeA);
    // console.log('Magnitude B', magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
        // console.error('One or both vectors are zero vectors:', vecA, vecB);
        return 0;
    }

    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
    // console.log('similarity', dotProduct / (magnitudeA * magnitudeB));
    return dotProduct / (magnitudeA * magnitudeB);
};

// retrieving top 5 chunks from the db using cosine similarity
async function getSimilarChunks(queryEmbedding) {
    try {
        //console.log('Query Embedding:', queryEmbedding); 
        const poolConnection = await pool;

        // retrieve all embeddings and chunks from the Content table
        console.log('Retrieving embeddings and chunks from the Content table...');
        const result = await poolConnection.request()
            .query('SELECT contentId, contentTextChunk, embedding FROM Content');
        const similarityThreshold = 0.5;
        console.log('Database returned records:', result.recordset.length); 
        // const contentData = result.recordset.map(record => {
        //   try{
        //     const embeddingArray = JSON.parse(record.embedding.toString());
        //     if(!Array.isArray(embeddingArray) || embeddingArray.length === 0){
        //       console.error('contentid', record.contentId, embeddingArray);
        //       console.error(new Float32Array(record.embedding))
        //     }
        //     return {
        //       contentId: record.contentId,
        //       contentTextChunk: record.contentTextChunk,
        //       embedding: new Float32Array(record.embedding)
        //     }
        //   } catch(error){
        //     console.error('erros');
        //     return null;
        //   }
            
        
        // });
  
        const contentData = result.recordset.map(record => {
          try {
              const buffer = record.embedding;
      
              if (Buffer.isBuffer(buffer)) {
                  // 将 Buffer 转换为 Float32Array
                  const floatArray = new Float32Array(buffer.buffer, buffer.byteOffset, buffer.length / Float32Array.BYTES_PER_ELEMENT);
      
                  // 确保最终转换为长度为 6144 的数组
                  const resizedArray = new Float32Array(6144);
                  if (floatArray.length >= 6144) {
                      // 如果长度大于或等于 6144，截取前 6144 个元素
                      resizedArray.set(floatArray.subarray(0, 6144));
                  } else {
                      // 如果长度小于 6144，复制所有元素，剩下的默认为 0
                      resizedArray.set(floatArray);
                  }
      
                  return {
                      contentId: record.contentId,
                      contentTextChunk: record.contentTextChunk,
                      embedding: resizedArray
                  };
              } else {
                  console.error('Embedding is not a buffer for contentId:', record.contentId);
                  return null;
              }
          } catch (error) {
              console.error('Error converting embedding for contentId:', record.contentId, error);
              return null;
          }
      }).filter(item => item !== null);
      
        




        // calculate cosine similarity for each chunk
        console.log('Calculating cosine similarity for each chunk...');
        const similarities = contentData.map(content => ({
            contentId: content.contentId,
            contentTextChunk: content.contentTextChunk,
            similarity: calculateCosineSimilarity(queryEmbedding, content.embedding),
        }));
        const filteredSimilarities = similarities.filter(item => item.similarity >= similarityThreshold);
        // sorting by similarity score and return the top 5 results
        filteredSimilarities.sort((a, b) => b.similarity - a.similarity);
        const sort = similarities.sort((a, b)=> b.similarity - a.similarity);
        console.log('Top 5 similar chunks:', sort.slice(0, 10));
        const np = similarities.filter(item=>item.contentId >= 97 && item.contentId <= 115);
        console.log(np);
        return filteredSimilarities.slice(0, 5);
    } catch (err) {
        console.error('Error retrieving similar chunks:', err.message);
        return [];
    }
}

// create response using userMessage
async function generateResponse(userMessage) {
    try {
      console.log('Step 1: Generating embeddings for user query...');
      // const sentences = userMessage.split(/[\.\!\?]\s*/); 
      const sentences = userMessage;
      console.log(sentences);
      const queryEmbedding = await generateEmbeddings([sentences]);
      const queryEmbeddingArray = queryEmbedding.map(buffer => new Float32Array(buffer)); 
  
      //console.log('Generated query embedding:', queryEmbeddingArray);
  
      // retrieve similar chunks from the database
      let allSimilarChunks = [];
      for( let embedding of queryEmbeddingArray){
        const similarChunks = await getSimilarChunks(embedding);
        allSimilarChunks = allSimilarChunks.concat(similarChunks);
      }
      // const similarChunks = await getSimilarChunks(queryEmbeddingArray[0]); // Pass the first embedding
  
      const uniqueChunks = [];
      const uniqueIds = new Set();
      allSimilarChunks.forEach(chunk => {
          if (!uniqueIds.has(chunk.contentId)) {
              uniqueIds.add(chunk.contentId);
              uniqueChunks.push(chunk);
          }
      });

      uniqueChunks.sort((a, b) => b.similarity - a.similarity);
      const topChunks = uniqueChunks.slice(0, 5);  

      let context = '';
      let contextSource = '';
      console.log(topChunks.length);
      for(let i = 0; i < 5; i++){
        // console.log(topChunks[i]);
      }
      if (topChunks.length > 0) {
          context = topChunks.map(chunk => chunk.contentTextChunk).join('\n');
          contextSource = '';
      } else {
          contextSource = 'Sorry, we couldn\'t find any relevant information based on what you provided. Here\'s a general response from the web:';
      }
  
      // send request to openai api
      const result = await client.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a professional assistant that helps users recall and understand information from online content they have provided. Use the given context to answer their questions accurately and concisely. If the required information is not in the provided content, inform the user and offer general guidance if appropriate. Always ensure your responses are clear, concise, and relevant to the query from the user.' },
          { role: 'user', content: `Context: ${context}\n\nQuestion: ${userMessage}` },
        ],
        model: 'gpt-4',
      });
  
      const answer = result?.choices[0]?.message?.content || 'No response generated.';
      console.log('Generated response from OpenAI:', contextSource, answer);
      return `${contextSource}\n\n${answer}`;
    } catch (error) {
      console.error('Error generating response:', error.message);
      throw error;
    }
}
let message = 'what is NP-completed?'
// generateResponse(message);
module.exports = { generateResponse };
