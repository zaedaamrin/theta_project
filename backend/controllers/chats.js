const { pool } = require('../database.js');
const { generateResponse, generateChatTitle } = require('../helpers/ragHelpers.js');
const sql = require('mssql');

const chatController = {
    // retrieving the list of chats for a user
    getChats: async (req, res) => {
        const userId = parseInt(req.params.userId);

        try {
            const poolConnection = await pool;
            const result = await poolConnection.request()
                .input('userId', sql.Int, userId)
                .query(`
                    SELECT chatId, chatName, lastOpenedDate
                    FROM Chats
                    WHERE userId = @userId
                    ORDER BY lastOpenedDate DESC
                `);

            if (result.recordset.length > 0) {
                res.status(200).json({ chats: result.recordset });
            } else {
                res.status(404).json({ message: 'No chats found for this user' });
            }
        } catch (err) {
            console.error('Error fetching chats:', err);
            res.status(500).json({ error: 'Error fetching chat list' });
        }
    },

    // Create a new chat for a user
    postChat: async (req, res) => {
        const userId = parseInt(req.params.userId);
        const { chatName } = req.body;

        try {
            const poolConnection = await pool;
            const result = await poolConnection.request()
                .input('userId', sql.Int, userId)
                .input('chatName', sql.NVarChar, chatName || 'Untitled Chat')
                .query(`
                    INSERT INTO Chats (userId, chatName, lastOpenedDate)
                    OUTPUT inserted.chatId
                    VALUES (@userId, @chatName, GETDATE())
                `);

            const chatId = result.recordset[0].chatId;
            res.status(201).json({ message: 'Chat created successfully!', chatId });
        } catch (err) {
            console.error('Error creating chat:', err);
            res.status(500).json({ error: 'Error creating chat' });
        }
    },
    //删除一个chat
    deleteChat: async(req, res) => {
        const userId = parseInt(req.params.userId);
        const chatId = parseInt(req.params.chatId);
        console.log(userId);
        console.log(chatId);
        try {
            const poolConnection = await pool;
            const resultSelectChatHistory = await poolConnection.request()
            .input('chatId', sql.Int, chatId)
            .query(`
                SELECT * FROM ChatHistory
                    WHERE chatId = @chatId
                `);
            console.log(resultSelectChatHistory.recordset);
            const resultSelectChats = await poolConnection.request()
            .input('userId', sql.Int, userId)
            .input('chatId', sql.Int, chatId)
            .query(`
                SELECT * FROM Chats
                    WHERE userId = @userId AND chatId = @chatId
                `);
            console.log(resultSelectChats.recordset);
            const resultDeleteChatHistory = await poolConnection.request()
                .input('chatId', sql.Int, chatId)
                .query(`
                    DELETE FROM ChatHistory
                        WHERE chatId = @chatId
                    `);
            const resultDeleteChats = await poolConnection.request()
                .input('userId', sql.Int, userId)
                .input('chatId', sql.Int, chatId)
                .query(`
                    DELETE FROM Chats
                        WHERE userId = @userId AND chatId = @chatId
                    `);
            console.log(resultDeleteChatHistory);
            console.log(resultDeleteChats);
            if(resultDeleteChats.rowsAffected[0] > 0 && resultDeleteChatHistory.rowsAffected[0] > 0){
                res.status(200).json({message: 'delete success'});
            }else{
                res.status(404).json({message: 'delete fail'});
            }
        } catch(err){
            res.status(500).json({error: 'Internal server error'});
        }
    },

    // Get the chat history for a specific chat
    getChatHistory: async (req, res) => {
        const chatId = parseInt(req.params.chatId);

        try {
            const poolConnection = await pool;
            const result = await poolConnection.request()
                .input('chatId', sql.Int, chatId)
                .query(`
                    SELECT prompt, answer, timestamp, messageOrder
                    FROM ChatHistory
                    WHERE chatId = @chatId
                    ORDER BY messageOrder ASC
                `);

            if (result.recordset.length > 0) {
                res.status(200).json({ messages: result.recordset });
            } else {
                res.status(404).json({ message: 'No messages found for this chat' });
            }
        } catch (err) {
            console.error('Error fetching chat history:', err);
            res.status(500).json({ error: 'Error fetching chat history' });
        }
    },

    // sending new message to a chat and get a response
    postMessage: async (req, res) => {
        const chatId = parseInt(req.params.chatId);
        const userMessage = req.body.message;

        try {
            const poolConnection = await pool;

            // getting current message order for the chat
            const orderResult = await poolConnection.request()
                .input('chatId', sql.Int, chatId)
                .query(`
                    SELECT ISNULL(MAX(messageOrder), 0) + 1 AS nextMessageOrder
                    FROM ChatHistory
                    WHERE chatId = @chatId
                `);
            const messageOrder = orderResult.recordset[0].nextMessageOrder;
            console.log('Order Result:', orderResult.recordset);
            if(messageOrder === 1){
                console.log(userMessage);
                const chatName = await generateChatTitle(userMessage);
                await poolConnection.request()
                        .input('chatId', sql.Int, chatId)
                        .input('chatName', sql.NVarChar, chatName)
                        .query(`
                            UPDATE Chats
                            SET chatName = @chatName
                            WHERE chatId = @chatId
                        `);
            }
            const result = await poolConnection.request()
                            .input('chatId', sql.Int, chatId)
                            .query(`
                                SELECT userId
                                FROM Chats
                                WHERE chatId = @chatId
                            `);
            const userId = result.recordset.length > 0 ? result.recordset[0].userId : null;
            // generate bot response using the RAG pipeline
            console.log('Calling generateResponse with userMessage:', userMessage);
            const modelResponse = await generateResponse(userMessage, userId);
            console.log('Model response:', modelResponse);

            // Save the user message to ChatHistory
            await poolConnection.request()
                .input('chatId', sql.Int, chatId)
                .input('prompt', sql.NVarChar, userMessage)
                .input('answer', sql.NVarChar, modelResponse)
                .input('messageOrder', sql.Int, messageOrder)
                .query(`
                    INSERT INTO ChatHistory (chatId, prompt, answer, messageOrder, timestamp)
                    VALUES (@chatId, @prompt, @answer, @messageOrder, GETDATE())
                `)
                .then(() => {
                    console.log('User message inserted successfully');
                })
                .catch((error) => {
                    console.error('Error inserting user message:', error);
                    res.status(500).json({ error: 'Error inserting user message' });
                    return;
                });

            // Save the bot response to ChatHistory
            // await poolConnection.request()
            //     .input('chatId', sql.Int, chatId)
            //     .input('prompt', sql.NVarChar, null)
            //     .input('answer', sql.NVarChar, botResponse)
            //     .input('messageOrder', sql.Int, messageOrder + 1)
            //     .query(`
            //         INSERT INTO ChatHistory (chatId, prompt, answer, messageOrder, timestamp)
            //         VALUES (@chatId, @prompt, @answer, @messageOrder, GETDATE())
            //     `);

            //Update the lastOpenedDate for the chat
            await poolConnection.request()
                .input('chatId', sql.Int, chatId)
                .query(`
                    UPDATE Chats
                    SET lastOpenedDate = GETDATE()
                    WHERE chatId = @chatId
                `);

            res.status(201).json({ response: modelResponse });
        } catch (err) {
            console.error('Error sending message:', err);
            res.status(500).json({ error: 'Error sending message' });
        }
    }
};

module.exports = { chatController };
