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
    
    postMessage: (req, res) => {
        const user = parseInt(req.params.userId);
        const chat = parseInt(req.params.chatId);

        // TODO: implement when integrated with db:
        // post new message to chat associated with user 
        // RAG pipeline to generate answer
        // Send answer in res

        res.status(201).json({answer: "Placeholder for answer"});
    }
}

export { chatController };