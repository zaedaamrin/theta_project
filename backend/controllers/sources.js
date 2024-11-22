const { pool} = require('../database.js');
const { scrapeUrl, generateChunks, generateEmbeddings } = require('../helpers/sourcesHelpers.js');
const sql = require('mssql');

const sourceController = {
  getSources: async (req, res) => {
    const userId = parseInt(req.params.userId);
    try{
      const poolConnection = await pool;
      const result = await poolConnection.request()
                              .input('userId', sql.Int, userId)
          .query('SELECT s.sourceId, s.URL, s.saveDate, s.rawData, us.userSourceId, us.title, us.tags FROM Sources s, UserSource us WHERE s.sourceId = us.sourceId AND us.userId = @userId');
      if(result.recordset.length >0){
        res.status(200).json({ sources: result.recordset[0]});  // 返回所有找到的记录
      } else {
        res.status(404).json({ message: 'No sources found for this user' });
      }
    } catch(err){
      console.error('Error fetching sources:', err);
      res.status(500).json({ error: 'Error fetching sources' });
    }
  },

  //save urls' raw data in sources table 
  postSource: async (req, res) => {
    console.log("Start POST request");
    const userId = parseInt(req.params.userId);
    const { urlName, url } = req.body;

    try {
        // Validate userId
        const poolConnection = await pool;
        const userCheckResult = await poolConnection.request()
            .input('userId', sql.Int, userId)
            .query('SELECT 1 FROM Users WHERE userId = @userId');

        if (userCheckResult.recordset.length === 0) {
            const errorMessage = `Invalid userId: ${userId}. The user does not exist in the system. Please use a valid userId.`;
            console.error(errorMessage);
            return res.status(400).json({ error: errorMessage });
        }

        if (!url || !urlName) {
            const errorMessage = 'URL and URL Name are required in the request body.';
            console.error(errorMessage);
            return res.status(400).json({ error: errorMessage });
        }

        const tags = "1"; // Temporary tagging for the source

        // Scrape URL
        const { title, rawData } = await scrapeUrl(url);
        console.log('Scraped URL:', { title, rawData });

        const chunks = await generateChunks(rawData);
        console.log('Generated chunks:', chunks[0]);

        const embeddings = await generateEmbeddings(chunks);
        console.log('Generated chunks:', embeddings[0]);


        // Insert into Sources table
        const insertSourceResult = await poolConnection.request()
            .input('URL', sql.NVarChar, url)
            .input('rawData', sql.NVarChar, rawData)
            .query(`
                INSERT INTO Sources (URL, saveDate, rawData)
                OUTPUT inserted.sourceId
                VALUES (@URL, GETDATE(), @rawData)
            `);

        const sourceId = insertSourceResult.recordset[0]?.sourceId;
        if (!sourceId) {
            throw new Error('Failed to retrieve inserted sourceId');
        }

        // Insert into UserSource table
        await poolConnection.request()
            .input('userId', sql.Int, userId)
            .input('sourceId', sql.Int, sourceId)
            .input('title', sql.NVarChar, urlName)
            .input('tags', sql.NVarChar, tags)
            .query(`
                INSERT INTO UserSource (userId, sourceId, title, tags)
                VALUES (@userId, @sourceId, @title, @tags)
            `);

        // Insert chunks and embeddings into Content table
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const embedding = embeddings[i];

            if (!embedding || embedding.length === 0) {
                console.error(`Skipping invalid embedding for chunk ${i + 1}`);
                continue;
            }

            const serializedEmbedding = Buffer.from(JSON.stringify(embedding));
            console.log(`Inserting chunk ${i + 1} with embedding size: ${serializedEmbedding.length}`);

            await poolConnection.request()
                .input('sourceId', sql.Int, sourceId)
                .input('chunkOrder', sql.Int, i + 1)
                .input('contentTextChunk', sql.NVarChar, chunk)
                .input('embedding', sql.VarBinary, serializedEmbedding)
                .query(`
                    INSERT INTO Content (sourceId, chunkOrder, contentTextChunk, embedding, embeddingDate)
                    VALUES (@sourceId, @chunkOrder, @contentTextChunk, @embedding, GETDATE())
                `);
        }

        res.status(201).json({
            status: 'Sources received, scraped, and embedded successfully!',
            sources: { title, rawData }
        });
    } catch (err) {
        console.error('Error handling sources:', err.message, err.stack);
        res.status(500).json({ error: 'Error processing sources', details: err.message });
    }
},

  deleteSource: async (req, res) => {
    const user = parseInt(req.params.userId);
    const sourceId = parseInt(req.params.sourceId);
    try{
      const poolConnection = await pool;
      const result = await poolConnection.request()
                              .input('id', sql.Int, sourceId)
                              .query('DELETE FROM Sources where id = @id');

      if (result.rowsAffected[0] > 0) {
        res.status(200).json({ message: 'Source deleted successfully!' });
      } else {
        res.status(404).json({ message: 'Source not found or user does not have permission to delete it.' });
      }
    } catch(err) {
      console.error('Error deleting source:', err);
      res.status(500).json({ error: 'Error deleting source' });
    }
  },

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
  },

  // expose similarity search endpoint
  searchSimilar: async (req, res) => {
    const { queryText } = req.body;
  
    try {
      // generate query embedding
      const queryEmbedding = await generateEmbeddings([queryText]);
  
      // retrieve similar chunks
      const results = await getSimilarChunks(queryEmbedding[0]);
  
      res.status(200).json({ results });
    } catch (err) {
      console.error('Error performing similarity search:', err);
      res.status(500).json({ error: 'Error performing similarity search' });
    }
  }
}

module.exports = { sourceController };