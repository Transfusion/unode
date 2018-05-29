var express = require('express');
var router = express.Router();
var path = require('path');
// singleton
// var GameManager = require('../GameManager');

router.get('/', function(req, res) {
    // console.log(req.session);
    // if the session is empty,
    if (req.session.isLoggedIn){
        // res.send("loggedin");
        res.redirect('/lobby');
    }
    else {
        res.sendFile(path.resolve(__dirname + '/../public/login.html'));
    }
});

router.get('/lobby', function(req, res){
    if (req.session.isLoggedIn){
        /*if (req.session.pendingGameId != null){
            res.redirect('/game_interface');
        }
        else {*/
            res.sendFile(path.resolve(__dirname + '/../public/games_browser.html'));
        // }
    }
    else {
        res.redirect('/');
    }
});

module.exports = router;