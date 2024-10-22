const express = require('express');
const router = express.Router();


router.route("/").post((req, res) => {
    const { emailAddress, password } = req.body;
    //database
})

module.exports = router;