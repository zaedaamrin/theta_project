// const { completionModel } = require('../completionModel.js');
const { generateResponse } = require('../helpers/ragHelpers.js');

const chatController = {
    getChats: (req, res) => {
        const user = parseInt(req.params.userId);

        // TODO: get chats associated with user when integrated with db

        res.json({chats: "placeholder for chats"});
    },

    postChat: (req, res) => {
        const user = parseInt(req.params.userId);

        // TODO: create new chat associated with user when integrated with db

        res.status(201).json({message: "Chat created!"});
    },

    getChat: (req, res) => {
        const user = parseInt(req.params.userId);
        const chat = parseInt(req.params.chatId);

        // TODO: get the chat data associated with user when integrated with db

        res.json({message: "placeholder for chat data"});
    },

    deleteChat: (req, res) => {
        const user = parseInt(req.params.userId);
        const chat = parseInt(req.params.chatId);

        // TODO: delete the chat from user when integrated with db

        res.json({message: "Deleted chat!"});
    },  
    
    postMessage: async (req, res) => {
        const user = parseInt(req.params.userId);
        const chat = parseInt(req.params.chatId);

        const message = req.body.message

        try {
            const result = await generateResponse(message);
              res.status(201).json({response: result})
            } catch (error) {
              console.error("Error getting response from OpenAI client:", error);
              res.json({message: error})
            }
    }
}

module.exports = { chatController };
