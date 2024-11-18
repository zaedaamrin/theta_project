const {pool} = require('../database.js');
const { generateResponse } = require('../helpers/ragHelpers.js');

const chatController = {
    //get the list of chats
    getChats: async (req, res) => {
        const userId = parseInt(req.params.userId);
        try{
            const poolConnection = await pool;
            const result = await poolConnection.request()
                                    .input('userId', sql.Int, userId)
                                    .query('SELECT * FROM Chats WHERE userId = @userId');
            if(result.recordset.length > 0){
                res.status(200).json({})
            }
        } catch(err){

        }
    },
    //create a new chat
    postChat: (req, res) => {
        const user = parseInt(req.params.userId);

        // TODO: create new chat associated with user when integrated with db

        res.status(201).json({message: "Chat created!"});
    },

    getChatHistory: (req, res) => {
        const user = parseInt(req.params.userId);
        const chat = parseInt(req.params.chatId);

        // TODO: get the chat data associated with user when integrated with db

        res.json({message: "placeholder for chat data"});
    },

    // deleteChat: (req, res) => {
    //     const user = parseInt(req.params.userId);
    //     const chat = parseInt(req.params.chatId);

    //     // TODO: delete the chat from user when integrated with db

    //     res.json({message: "Deleted chat!"});
    // },  
    
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