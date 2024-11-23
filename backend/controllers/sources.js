const { pool } = require('../database.js');
const { scrapeUrl, generateChunks, generateEmbeddings } = require('../helpers/sourcesHelpers.js');
const sql = require('mssql');

const sourceController = {
    getSources: async (req, res) => {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId) || userId <= 0) {
            return res.status(400).json({ error: 'Invalid userId provided.' });
        }
        try {
            const poolConnection = await pool;
            const result = await poolConnection.request()
                .input('userId', sql.Int, userId)
                .query(`
                    SELECT 
                        s.sourceId, 
                        s.URL, 
                        s.saveDate, 
                        s.rawData, 
                        us.userSourceId, 
                        us.title, 
                        us.tags 
                    FROM Sources s, UserSource us
                    WHERE s.sourceId = us.sourceId AND us.userId = @userId 
                `);

            if (result.recordset.length > 0) {
                res.status(200).json({ sources: result.recordset });
            } else {
                res.status(404).json({ message: 'No sources found for this user' });
            }
        } catch (err) {
            console.error(`Error in getSources for userId ${userId}:`, err);
            res.status(500).json({ error: 'Internal server error while fetching sources.' });
        }
    },

    postSource: async (req, res) => {
        console.log("Start POST request");
        const userId = parseInt(req.params.userId);
        const { urlName, url } = req.body;
        console.log(urlName);
        console.log(url);

        if (!url || !urlName) {
            return res.status(400).json({ error: 'URL and URL Name are required.' });
            console.log("400");
        }

        try {
            console.log("start!");
            const poolConnection = await pool;
            console.log(userId);
            const userCheckResult = await poolConnection.request()
                .input('userId', sql.Int, userId)
                .query('SELECT 1 FROM Users WHERE userId = @userId');
            console.log(userCheckResult);

            if (userCheckResult.recordset.length === 0) {
                return res.status(400).json({ error: `Invalid userId: ${userId}` });
                console.log("400_2");
            }

            const { title, rawData } = await scrapeUrl(url);
            console.log('Scraped URL:', { title, rawData });
            const chunks = await generateChunks(rawData);
            console.log('Generated chunks:', chunks[0]);
            const embeddings = await generateEmbeddings(chunks);
            console.log('Generated chunks:', embeddings[0]);

            const insertSourceResult = await poolConnection.request()
                .input('URL', sql.NVarChar, url)
                .input('rawData', sql.NVarChar, rawData)
                .query(`
                    INSERT INTO Sources (URL, saveDate, rawData)
                    OUTPUT inserted.sourceId
                    VALUES (@URL, GETDATE(), @rawData)
                `);

            const sourceId = insertSourceResult.recordset[0]?.sourceId;
            console.log("insertSources");
            await poolConnection.request()
                .input('userId', sql.Int, userId)
                .input('sourceId', sql.Int, sourceId)
                .input('title', sql.NVarChar, urlName)
                .input('tags', sql.NVarChar, '1')
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
            res.status(201).json({ message: 'Source added successfully!' });
            console.log("sources added");
        } catch (err) {
            console.error('Error in postSource:', err);
            res.status(500).json({ error: 'Internal server error while adding source.' });
            console.log("500");
        }
    },

    deleteSource: async (req, res) => {
        const userId = parseInt(req.params.userId);
        const sourceId = parseInt(req.params.sourceId);

        try {
            const poolConnection = await pool;
            const result = await poolConnection.request()
                .input('userId', sql.Int, userId)
                .input('sourceId', sql.Int, sourceId)
                .query(`
                    DELETE FROM UserSource
                    WHERE userId = @userId AND sourceId = @sourceId
                `);

            if (result.rowsAffected[0] > 0) {
                res.status(200).json({ message: 'Source deleted successfully!' });
            } else {
                res.status(404).json({ message: 'Source not found or user does not have permission to delete it.' });
            }
        } catch (err) {
            console.error('Error in deleteSource:', err);
            res.status(500).json({ error: 'Internal server error while deleting source.' });
        }
    }
};

module.exports = { sourceController };
