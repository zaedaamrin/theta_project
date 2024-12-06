const { pool } = require('../database.js');
const { generateEmbeddings } = require('./sourcesHelpers.js');
const { client } = require('../models/completionModel');
const sql = require('mssql');
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
async function getSimilarChunks(queryEmbedding, userId) {
    try {
        //console.log('Query Embedding:', queryEmbedding); 
        const poolConnection = await pool;
        // retrieve all embeddings and chunks from the Content table
        console.log('Retrieving embeddings and chunks from the Content table...');
        console.log("userId of chunks:", userId);
        const result = await poolConnection.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT c.contentId, c.contentTextChunk, c.embedding 
                    FROM Content c, Sources s, UserSource us 
                    WHERE userId = @userId AND us.sourceId = s.sourceId AND c.sourceId = s.sourceId;
                `);
        
        console.log(result);
        const similarityThreshold = 0.4;
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
        console.log("length of embeddings", queryEmbedding.length);
    //     const contentData = result.recordset.map(record => {
    //       try {
    //         const binary = record.embedding;
    //         const arrayBuffer = binary.buffer.slice(binary.byteOffset,binary.byteOffset+binary.byteLength);
    //         const originalEmbeddings =  Array.from(new Float32Array(arrayBuffer));
    //         console.log("length of chunks", originalEmbeddings.length);
    //               return {
    //                   contentId: record.contentId,
    //                   contentTextChunk: record.contentTextChunk,
    //                   embedding: originalEmbeddings
    //               };
    //           } 
    //       catch (error) {
    //           console.error('Error converting embedding for contentId:', record.contentId, error);
    //           return null;
    //       }
    //   })
    const contentData = result.recordset.map(record => {
        if (!record || !record.embedding || !record.contentId) {
          console.warn('Invalid record found:', record);
          return null;
        }
      
        try {
          const binary = record.embedding;
          const arrayBuffer = binary.buffer.slice(binary.byteOffset, binary.byteOffset + binary.byteLength);
          const originalEmbeddings = Array.from(new Float32Array(arrayBuffer));
          return {
            contentId: record.contentId,
            contentTextChunk: record.contentTextChunk,
            embedding: originalEmbeddings
          };
        } catch (error) {
          console.error('Error converting embedding for contentId:', record.contentId, error);
          return null;
        }
      }).filter(item => item !== null); // 过滤掉无效的记录
      


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
async function generateResponse(userMessage,userId) {
    try {
      console.log('Step 1: Generating embeddings for user query...');
      // const sentences = userMessage.split(/[\.\!\?]\s*/); 
      const sentences = userMessage;
      console.log(sentences);
      const queryEmbedding = await generateEmbeddings([sentences]);
    //   const queryEmbeddingArray = queryEmbedding.map(buffer => new Float32Array(buffer)); 
      const originalQueryEmbeddings = queryEmbedding.map(binary => {
           const arrayBuffer = binary.buffer.slice(binary.byteOffset,binary.byteOffset+binary.byteLength);
           return Array.from(new Float32Array(arrayBuffer));
         })
      //console.log('Generated query embedding:', queryEmbeddingArray);
  
      // retrieve similar chunks from the database
      let allSimilarChunks = [];
      for( let embedding of originalQueryEmbeddings){
        const similarChunks = await getSimilarChunks(embedding, userId);
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
          { role: 'system', content: 'You are a professional assistant that helps users recall and understand information from online content they have provided. Use the given context to answer their questions accurately and concisely. If the required information is not in the provided content, do not generate any response. Always ensure your responses are clear, concise, and relevant to the query from the user.' },
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

// generate chat title based on the first prompt
async function generateChatTitle(userFirstPrompt) {
    try {
      const result = await client.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an assistant that generates concise and descriptive titles for conversations based on user input. Ensure the title captures the essence of the conversation and is short and clear.' },
          { role: 'user', content: `Please provide a concise and descriptive title for the following prompt: "${userFirstPrompt}"` },
        ],
        model: 'gpt-4',
      });
      const title = result?.choices[0]?.message?.content.trim() || 'Untitled';
      console.log('Generated chat title:', title);
      return title;
    } catch (error) {
      console.error('Error generating chat title:', error.message);
      throw error;
    }
  } 
// let userFirstPrompt = "how much is the tear of kingdom?"
// console.log(generateChatTitle(userFirstPrompt));

// let message = 'what is splatoon 3?'
// generateResponse(message);
module.exports = { generateResponse, generateChatTitle };