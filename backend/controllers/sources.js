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
          .query('SELECT s.SourceId, s.URL, s.saveDate, s.rawData, us.userSourceId, us.title, us.tags FROM Sources s, userSource us WHERE s.SourceId = us.sourceId AND us.userId = @userId');
      if(result.recordset.length >0){
        res.status(200).json({ sources: result.recordset });  // 返回所有找到的记录
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
    console.log("start post request")
    const userId = parseInt(req.params.userId);
    const {urlName, url} = req.body;  //TODO: personalize urlName or generate by AI or webscraping title, for now I use personlized urlName
    
    try{
      const poolConnection = await pool;
      const tags = "1";   // ToDo: tag the data

      const {title, rawData} = await scrapeUrl(url);
      const chunks = await generateChunks(rawData);
      const embeddings = await generateEmbeddings(chunks);

      const insertSourceResult = await poolConnection.request().input('URL', sql.NVarChar, url)
                          // .input('tags', sql.NVarChar, tags)
                          .input('rawData', sql.NVarChar, rawData)
                          .query('INSERT INTO Sources(URL, saveDate, rawData) VALUES (@URL, GETDATE(), @rawData)')
      await poolConnection.request().input('userId', sql.Int, userId)
                          .input('sourceId', sql.Int, insertSourceResult.recordset[0].sourceId)
                          .input('title', sql.NVarChar, urlName)
                          .input('tags', sql.NVarChar, tags)
                          .query('INSERT INTO UserSource(userId, sourceId, title, tags) VALUES (@userId, @sourceId, @title, @tags)');
      
      res.status(201).json({status: 'Sources received and scraped successfully!', sources: {"title": title, "rawData": rawData}});
    } catch (err) {
      console.error('Error handling sources', err);
      res.status(500).json({error:'Error processing sources'});
    }
    // for each url in request body, 
  },
  // TODO: implement this when db is connected-
    // save the content and save the embeddings
    // return a list of data objects for each source

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
    // TODO: implement this when db is connected

    
  }
}

module.exports = { sourceController };