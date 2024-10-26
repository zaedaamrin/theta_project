const sourceController = {
  getSources: (req, res) => {
    const user = parseInt(req.params.userId);
    const data = req.body;

    res.json({ sources: 'Placeholder for json object of sources' });
  },

  postSource: (req, res) => {
    const user = parseInt(req.params.userId);
    const data = req.body;

    // TODO: implement this when db is connected

    res.status(201).json({message: 'Sources received successfully!'});
  },

  deleteSource: (req, res) => {
    const user = parseInt(req.params.userId);
    const sourceId = parseInt(req.params.sourceId);

    // TODO: implement this when db is connected

    res.json({message: 'Source deleted successfully!'});
  }
}

module.exports = { sourceController };