import { scrapeUrl } from '../helpers/sourcesHelpers.js';
import { chromium, firefox } from 'playwright';

const sourceController = {
  getSources: (req, res) => {
    const user = parseInt(req.params.userId);
    const data = req.body;

    res.json({ message: 'Placeholder for json object of sources',  });
  },

  postSource: async (req, res) => {
    const user = parseInt(req.params.userId);
    // get url list from request body
    const {sources} = req.body;

    const newSources = []
    // for each url in request body, 
    for (const url of sources) {
      // chunk the content, 
    // embed the chunks, 
      newSources.push(await scrapeUrl(url));
    }
    res.status(201).json({status: 'Sources received successfully!', sources: newSources});
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