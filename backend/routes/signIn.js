const express = require('express');
const router = express.Router();


router.route("/").post((req, res) => {
    const { emailAddress, password } = req.body;
    //database
})


router.route("/").get((req, res) => {
    res.send('hi, this is the sign in page!');
})



module.exports = router;