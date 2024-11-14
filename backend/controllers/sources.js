const { scrapeUrl, generateChunks, generateEmbeddings } = require('../helpers/sourcesHelpers.js');

const sourceController = {
  getSources: (req, res) => {
    const user = parseInt(req.params.userId);
    const data = req.body;

    res.json({ message: 'Placeholder for json object of sources',  });
  },

  postSource: async (req, res) => {
    const user = parseInt(req.params.userId);
    const {source} = req.body;

    try {
      const {title, rawData} = await scrapeUrl(source);
      const chunks = await generateChunks(rawData);
      const embeddings = await generateEmbeddings(chunks);

      // TODO: insert a new source into sources table, insert new rows into content table

      res.status(201).json({status: 'Sources received successfully!', source: {"title": title, "rawData": rawData}});
    } catch (error) {
      console.error('Error processing source:', error);
      res.status(404).json({message: "Could not scrape URL"});
    }

  },

  deleteSource: (req, res) => {
    const user = parseInt(req.params.userId);
    const sourceId = parseInt(req.params.sourceId);

    // TODO: implement this when db is connected

    res.json({message: 'Source deleted successfully!'});
  }
}

module.exports = { sourceController };