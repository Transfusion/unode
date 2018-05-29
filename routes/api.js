var logger = require('../logging').logger;
var express = require('express');
var router = express.Router();
var path = require('path');
var tripcode = require('tripcode');

var ruleset = require('../GamePOJOs/ruleset');

var UserManager = require('../managers/UserManager');
var GameManager = require('../managers/GameManager');
// singleton

var createGameController = require('../Controllers/create_game_controller');


router.get('/pending_games', function(req, res){
    
})

router.post('/login', function(req, res){
    // console.log(req.body);
    // console.log(req.session);
    var userObj = UserManager.addUser(req.body.name, tripcode(req.body.tripcode), req.body.avatar);
    req.session.isLoggedIn = true;
    // TODO: could result in XSS
    // req.session.playerInfo = {};
    // req.session.playerInfo.name = req.body.name;
    // req.session.playerInfo.tripcode = tripcode(req.body.tripcode);
    // req.session.playerInfo.avatar = req.body.avatar;
    req.session.user = userObj.id;

    req.session.save();
    res.send(req.session.user);
    // res.redirect(200, '/');
});

router.post('/logout', function(req, res){
    
})

router.get('/user_info', function(req, res){

    function _populatePendingGameFields(userObj){
        if (userObj['pendingGameId']){
            userObj['pending_game_am_host'] = 
                (GameManager.getPendingGame(userObj['pendingGameId']).hostUser == userObj.id);
        }        
        console.log(userObj);
    }

    if (!req.session.isLoggedIn){
        res.send("Not logged in");
    }
    else {
        // res.setHeader('Content-Type', 'application/json');
        var userObj = UserManager.getUser(req.session.user);
        _populatePendingGameFields(userObj);


        // res.send(JSON.stringify(req.session.user));
        // console.log(req.session.user)
        res.json(userObj);
    }
});

router.get('/user_info/:userId', function(req, res){
    if (!req.session.isLoggedIn){
        res.send("Not logged in");
    }
    else {
        try {
            var userObj = UserManager.getUser(req.params['userId']);
            res.json(userObj);
        }
        catch(err){
            logger.error(err);
            res.sendStatus(404);
        }

    }
});

router.post('/create_game', createGameController.createGame);

router.get('/ws_token', function(req, res){
    if (!req.session.isLoggedIn){
        res.send("Not logged in");
    }
    else {
        // doesn't work, https://groups.google.com/forum/#!msg/nodejs/5YJhT-uLGjI/3og31FuJib4J express does 
        // serializing behind the scenes.
        // res.send(req.session.user.generateWSToken());
        
        var userObj = UserManager.getUser(req.session.user);
        res.json({'token': userObj.generateWSToken()});
    }
    
});

router.get('/rulesets', function(req, res){
    // console.log(Object.entries(ruleset.AvailableRuleSets));

    function _ruleset2JSON(rset){
        // console.log(ruleset.parameters);
        var jsonObj = {};
        jsonObj.description = rset.infoString;
        jsonObj.parameters = {};
        for (let [key, val] of Object.entries(rset.parameters)){
            jsonObj.parameters[key] = {}
            jsonObj.parameters[key].name = val.name;
            jsonObj.parameters[key].infoString = val.infoString;
            jsonObj.parameters[key].type = val.type;
            jsonObj.parameters[key].defaultVal = val.defaultVal;

            switch(val.type){
                case ruleset.parameters.PARAMETER_TYPE.INT_PARAM:
                    jsonObj.parameters[key].lwrBound = val.lwrBound;
                    jsonObj.parameters[key].uprBound = val.uprBound;
                    jsonObj.parameters[key].defaultValue = val.defaultValue;
                    break;
            }
        }
        return jsonObj;
    }

    var jsonObj = {};
    for (let [key, value] of Object.entries(ruleset.AvailableRuleSets)){
        jsonObj[key] = _ruleset2JSON(value);
    }
    console.log(jsonObj);
    res.json(jsonObj);
});

/*router.get('/ruleset/parameters', function(req, res){

});
*/
module.exports = router;