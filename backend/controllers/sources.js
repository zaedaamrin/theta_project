import { poolConnect, sql } from './db';
import { scrapeUrl } from '../helpers/sourcesHelpers.js';
import { chromium, firefox } from 'playwright';

const sourceController = {
  getSources: async (req, res) => {
    const userId = parseInt(req.params.userId);
    try{
      const pool = await poolConnect;
      const result = await pool.request()
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
  //TODO: chunk content and store them into content table
  postSource: async (req, res) => {
    const userId = parseInt(req.params.userId);
    // get url list from request body
    const {urlName, url} = req.body;  //TODO: personalize urlName or generate by AI or webscraping title, for now I use personlized urlName
    
    const newSources = []
    try{
      // TODO: chunk the content
      // TODO: embed the chunks
      // TODO: save the embeddings
      const pool = await poolConnect;
      const tags = "1";   // ToDo: tag the data
      const scrapeData = await scrapeUrl(url);
      const rawData = scrapeData.pageContent;
      const insertSourceResult = await pool.request().input('URL', sql.NVarChar, url)
                          // .input('tags', sql.NVarChar, tags)
                          .input('rawData', sql.NVarChar, rawData)
                          .query('INSERT INTO Sources(URL, saveDate, rawData) VALUES (@URL, GETDATE(), @rawData)')
      await pool.request().input('userId', sql.Int, userId)
                          .input('sourceId', sql.Int, insertSourceResult.recordset[0].sourceId)
                          .input('title', sql.NVarChar, urlName)
                          .input('tags', sql.NVarChar, tags)
                          .query('INSERT INTO UserSource(userId, sourceId, title, tags) VALUES (@userId, @sourceId, @title, @tags)');
      newSources.push(scrapeData);
      res.status(201).json({status: 'Sources received and scraped successfully!', sources: newSources});
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
      const pool = await poolConnect;
      const result = await pool.request()
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

export { sourceController };