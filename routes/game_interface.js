var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res) {
    // console.log(req.session);
    // if the session is empty,
    if (!req.session.isLoggedIn){
        // res.send("loggedin");
        res.redirect('/');
    }
    else {
        res.sendFile(path.resolve(__dirname + '/../public/game_interface.html'));
    }
});

module.exports = router;