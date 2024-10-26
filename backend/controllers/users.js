const userController = {
    getUsers: (req, res) => {
        // TODO: implement when connected with db

        res.json({ users: "placeholder for users data"});
    },

    postUser: (req, res) => {
        const data = req.body;
        // TODO: implement when connected with db

        res.status(201).json({message: "Chat created!"});
    },

    getUser: () => {
        const user = parseInt(req.params.userId);

        // TODO: implement when connected with db

        res.json({ users: "placeholder for user data"});
    }
}

module.exports = { userController };