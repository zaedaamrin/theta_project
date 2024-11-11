import { scrapeUrl, chunkText } from '../helpers/sourcesHelpers.js';
import { chromium, firefox } from 'playwright';

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11400';

const sourceController = {
  getSources: (req, res) => {
    const user = parseInt(req.params.userId);
    const data = req.body;

    res.json({ message: 'Placeholder for json object of sources',  });
  },

  postSource: async (req, res) => {
    const user = parseInt(req.params.userId);
    // get url from request body
    const {source} = req.body;
    const chunks = []

    // scrape the content, newSource 
    // const newSource = await scrapeUrl(source).then((scrapedData) async => {
    //   chunks = await chunkText(newSource.rawData)
    // }
      
    // ).then();

    // chunk the content
    
    

    // embed the chunks
    
    res.status(201).json({status: 'Sources received successfully!', source: newSource});
  },
  // TODO: implement this when db is connected-
    // save the content and save the embeddings
    // return a list of data objects for each source

  deleteSource: (req, res) => {
    const user = parseInt(req.params.userId);
    const sourceId = parseInt(req.params.sourceId);

    // TODO: implement this when db is connected

    res.json({message: 'Source deleted successfully!'});
  }
}

export { sourceController };