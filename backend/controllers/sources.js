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
                    FROM Sources s
                    INNER JOIN UserSource us ON s.sourceId = us.sourceId
                    WHERE us.userId = @userId
                    ORDER BY s.saveDate DESC
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

        if (!url || !urlName) {
            return res.status(400).json({ error: 'URL and URL Name are required.' });
        }

        try {
            const poolConnection = await pool;
            const userCheckResult = await poolConnection.request()
                .input('userId', sql.Int, userId)
                .query('SELECT 1 FROM Users WHERE userId = @userId');

            if (userCheckResult.recordset.length === 0) {
                return res.status(400).json({ error: `Invalid userId: ${userId}` });
            }

            const { title, rawData } = await scrapeUrl(url);
            const chunks = await generateChunks(rawData);
            const embeddings = await generateEmbeddings(chunks);

            const insertSourceResult = await poolConnection.request()
                .input('URL', sql.NVarChar, url)
                .input('rawData', sql.NVarChar, rawData)
                .query(`
                    INSERT INTO Sources (URL, saveDate, rawData)
                    OUTPUT inserted.sourceId
                    VALUES (@URL, GETDATE(), @rawData)
                `);

            const sourceId = insertSourceResult.recordset[0]?.sourceId;

            await poolConnection.request()
                .input('userId', sql.Int, userId)
                .input('sourceId', sql.Int, sourceId)
                .input('title', sql.NVarChar, urlName)
                .input('tags', sql.NVarChar, '1')
                .query(`
                    INSERT INTO UserSource (userId, sourceId, title, tags)
                    VALUES (@userId, @sourceId, @title, @tags)
                `);

            res.status(201).json({ message: 'Source added successfully!' });
        } catch (err) {
            console.error('Error in postSource:', err);
            res.status(500).json({ error: 'Internal server error while adding source.' });
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
