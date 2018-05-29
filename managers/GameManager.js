var uuid = require('uuid');
var assert = require('assert');
var config = require('../config');
var logger = require('../logging').logger;
var CommsManager = require('../gamecomms/CommsManager');

var messaging = require('../gamecomms/Messaging');

var util = require('util');

class GameManager {
    constructor(){
        this.games = {};
        this.pendingGames = {};
    }

    getActiveGames(){
        return this.games;
    }

    getPendingGames(){
        return this.pendingGames;
    }

    getPendingGame(id){
        return this.pendingGames[id];
    }

    createGame(hostUser, ruleset){
        // NOT GONNA WORK LMAO
        /*unqId = Object.keys(this.pendingGames).length;        
        this.pendingGames[unqId] = new PendingGame(unqId, ruleset);*/
        var unqId = uuid.v1();
        this.pendingGames[unqId] = new PendingGame(unqId, hostUser, ruleset);
        return unqId;
    }

    initGame(id, ruleset, pendingUsers){
        console.log('test init ' + id);
    }

    deleteGame(gameID){
        delete this.games[gameID];
    }

    deletePendingGame(unqId){
        delete this.pendingGames[unqId];
    }
}

class PendingGame {
    constructor(unqId, hostUser, ruleset
        /*, joinUserCallback, leaveUserCallback, isReadyToStartCallback*/){
        this.id = unqId;

        /*ID in the user object of the host user
        this.hostId = hostId;*/
        this.hostUser = hostUser;

        this.ruleset = ruleset;

        console.log('asjfoiahg3r0g3o')
        console.log(ruleset.playerCount);

        this.timeout = config.game.pendingTimeout;
        this.timeoutExpireLoop = null; // set in _initPendingGameExpire

        // this.pendingUsers = []
        this.pendingUsers = new Set();
        this._initPendingGameExpire();

        /*this.joinUserCallback = joinUserCallback;
        this.leaveUserCallback = leaveUserCallback;
        this.isReadyToStartCallback = isReadyToStartCallback;*/
    }

    _initPendingGameExpire(){
        var pending_game_this = this;
        this.timeoutExpireLoop = setInterval(function(){
            console.log(pending_game_this.timeout);
            if (!(--pending_game_this.timeout)){
                pending_game_this._destroy();
                clearInterval(pending_game_this.timeoutExpireLoop);
            }
        }, 1000);
    }

    _destroy(){
        CommsManager.CommsManagerInstance.broadcastPendingGameMessage(
            new messaging.OutgoingMessages.pendingGameDestroyedMessage(this), this);

        for (let User of this.pendingUsers){
            User.pendingGameId = null;
        }

        gm.deletePendingGame(this.id);
    }

    setRuleset(params, User){
        assert(this.hostUser.id == User.id);

        // iterate over all the params 
        for (let [key, obj] of Object.entries(this.ruleset.params)){
            // logger.info(key);
            // testing that the string exists in the array.
            assert(Object.keys(params).indexOf(key) > -1);
            // convert to numeric value if it is;
            params[key] = (params[key] * 1) ? (params[key] * 1): params[key];
            assert(obj.constructor.validateFunc(params[key]));
        }

        for (let [key, obj] of Object.entries(this.ruleset.params)){
            obj.value = params[key];
        }

        // notify all connected users of the successful ruleset change
        CommsManager.CommsManagerInstance.broadcastPendingGameMessage(new messaging.OutgoingMessages.pendingGameRulesetMessage(this), this);

    }

    joinUser(User){
        if (this.canJoin){
            this.pendingUsers.add(User);
            // this.joinUserCallback(User);
            User.pendingGameId = this.id;
            User.commsClient.sendMessage(messaging.OutgoingMessages.pendingGameStateMessage(this, User));
            User.commsClient.sendMessage(messaging.OutgoingMessages.pendingGameRulesetMessage(this));

            CommsManager.CommsManagerInstance.broadcastPendingGameMessage(
                new messaging.OutgoingMessages.joinPendingGameSuccessMessage(this, User), this);

            return
        }
        else {
            User.commsClient.sendMessage(new messaging.OutgoingMessages.joinPendingGameFailedMessage(this, 'Game Full'));
        }

        if (this.isReadyToStart){
            CommsManager.CommsManagerInstance.broadcastPendingGameMessage(
                new messaging.OutgoingMessages.pendingGameReadyStartStatusMessage(this), true);
        }
        else {
            CommsManager.CommsManagerInstance.broadcastPendingGameMessage(
                new messaging.OutgoingMessages.pendingGameReadyStartStatusMessage(this), false);   
        }

    }

    leaveUser(User){
        // console.log(User + ' left');
        /*var index = this.pendingUsers.indexOf(User);
        if (index !== -1){
            this.pendingUsers.split(index, 1);
        }*/
        this.pendingUsers.delete(User);
        // this.leaveUserCallback(User)
        CommsManager.CommsManagerInstance.broadcastPendingGameMessage(
            messaging.OutgoingMessages.leavePendingGameSuccessMessage(this, User), this
        );

        // Send to the leaving user too
        User.commsClient.sendMessage(
            messaging.OutgoingMessages.leavePendingGameSuccessMessage(this, User), this  
        );

        User.pendingGameId = null;

        if (this.isReadyToStart){
            CommsManager.CommsManagerInstance.broadcastPendingGameMessage(
                messaging.OutgoingMessages.pendingGameReadyStartStatusMessage(this), true);
        }
        else {
            CommsManager.CommsManagerInstance.broadcastPendingGameMessage(
                new messaging.OutgoingMessages.pendingGameReadyStartStatusMessage(this), false);   
        }
    }

    get isReadyToStart(){
        /*if (this.pendingUsers.size == this.ruleset.playerCount){
            // this.isReadyToStartCallback(this);
            return this.pendingUsers.size == this.ruleset.playerCount;
        }       */
        // return this.pendingUsers.size <= this.ruleset.playerCount;
        return this.pendingUsers.size > 1;
    }

    get canJoin(){
        // console.log(this.pendingUsers.size + " " + this.ruleset.constructor.name);
        // console.log(util.inspect(this.ruleset));
        return this.pendingUsers.size <= this.ruleset.playerCount;
    }

    initGame(callingUser){
        if (callingUser.id === this.hostUser.id){
            gm.initGame(this.id, this.ruleset, this.pendingUsers);    
        }
        else {
            throw new Error('Only the host can start the game');
        }
    }
}

var gm = new GameManager();
module.exports = gm;