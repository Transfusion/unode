var UserManager = require('../managers/UserManager');
var GameManager = require('../managers/GameManager');

var ruleset = require('../GamePOJOs/ruleset');

var utils = require('../utils');
var logger = require('../logging').logger;

function createGame(req, res){
    console.log(req.body);

    if (!req.session.isLoggedIn){
        res.send("Not logged in");
        return
    }

    if (!req.body.ruleset in ruleset.AvailableRuleSets){
        res.json({
            'err': 'Invalid Ruleset'
        })
        return;
    }

    // the actual ruleset class
    var rset = ruleset.AvailableRuleSets[req.body.ruleset]

    var params = {};
    for (let [key, value] of Object.entries(rset.parameters)){
        if (!key in req.body){
            res.json({'err': 'Provide all parameters'});
            return
        }

        if (req.body[key] * 1){
            req.body[key] = req.body[key]*1;
        }

        params[key] = req.body[key];
    }
    // console.log('ancoook');
    var rsetInstance = new rset(params);
    // console.log(rsetInstance.params);
    // Instantiate the PendingGame

    // constructor(unqId, ruleset, joinUserCallback, leaveUserCallback, isReadyToStartCallback){
    try {
        var gameId = GameManager.createGame(UserManager.getUser(req.session.user), rsetInstance);
        res.json({
            'success': true,
            'gameId': gameId
        })
        logger.info('game created ' + GameManager.getPendingGame(gameId));
    }
    catch (error){
        logger.error(error);
        res.json({
            'err': 'Game creation failed'
        })
    }
    
}


module.exports.createGame = createGame;