var uuid = require('uuid');
var assert = require('assert');
var config = require('../config');
var logger = require('../logging').logger;
var CommsManager = require('../gamecomms/CommsManager');

var messaging = require('../gamecomms/Messaging');

// var Game = require('../GamePOJOs/game');
var util = require('util');
var assert = require('assert');

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

    initGame(pendingGameId){
        // var unqId = uuid.v1();

        var pendingGame = this.pendingGames[pendingGameId];
        
        /*for (let User of pendingGame.pendingUsers){
            User.pendingGameId = null;
        }*/
        var newGame = new Game(pendingGameId, pendingGame.ruleset, pendingGame.pendingUsers, pendingGame.hostUser);

        this.deletePendingGame(pendingGameId);
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
            // console.log(pending_game_this.timeout);
            if (!(--pending_game_this.timeout)){
                pending_game_this._destroy();
                clearInterval(pending_game_this.timeoutExpireLoop);
            }
            else {
                CommsManager.CommsManagerInstance.broadcastPendingGameMessage(
                    new messaging.OutgoingMessages.pendingGameTimeoutMessage(pending_game_this), pending_game_this);
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

            if (this.isReadyToStart){
                CommsManager.CommsManagerInstance.broadcastPendingGameMessage(
                    new messaging.OutgoingMessages.pendingGameReadyStartStatusMessage(this, true), this);
            }
            else {
                console.log('dafaq')
                CommsManager.CommsManagerInstance.broadcastPendingGameMessage(
                    new messaging.OutgoingMessages.pendingGameReadyStartStatusMessage(this, false), this);   
            }

        }
        else {
            User.commsClient.sendMessage(new messaging.OutgoingMessages.joinPendingGameFailedMessage(this, 'Game Full'));
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
            console.log('ajsdfioasjdoigjaiosdgjio')
            CommsManager.CommsManagerInstance.broadcastPendingGameMessage(
                messaging.OutgoingMessages.pendingGameReadyStartStatusMessage(this, true), this);
        }
        else {
            CommsManager.CommsManagerInstance.broadcastPendingGameMessage(
                new messaging.OutgoingMessages.pendingGameReadyStartStatusMessage(this, false), this);   
        }
    }

    get isReadyToStart(){
        /*if (this.pendingUsers.size == this.ruleset.maxPlayerCount){
            // this.isReadyToStartCallback(this);
            return this.pendingUsers.size == this.ruleset.maxPlayerCount;
        }       */
        // return this.pendingUsers.size <= this.ruleset.maxPlayerCount;
        return this.pendingUsers.size > 1;
    }

    get canJoin(){
        // console.log(this.pendingUsers.size + " " + this.ruleset.constructor.name);
        // console.log(util.inspect(this.ruleset));
        return this.pendingUsers.size <= this.ruleset.maxPlayerCount;
    }

    initGame(callingUser){
        assert(this.isReadyToStart);

        if (callingUser.id === this.hostUser.id){
            clearInterval(this.timeoutExpireLoop);

            for (let User of this.pendingUsers){
                User.pendingGameId = null;
            }

            gm.initGame(this.id, this.ruleset, this.pendingUsers);    
        }
        else {
            throw new Error('Only the host can start the game');
        }
    }
}

// note that ruleset is already instantiated by the time it comes in...
// easier to have the ruleset produce its own deck
// assume there's no set of rules which allow joining in the middle of game yet

var player = require("../GamePOJOs/player");
var card = require("../GamePOJOs/card");

class Game {

    static get AVAILABLE_STATES(){
        return {
            REGULAR_MOVE_STATE
        }
    }

    constructor(unqId, ruleset, users, hostUser){
        assert(ruleset.maxPlayerCount >= users.size);

        this.id = unqId;

        this.ruleset = ruleset;
        this.maxPlayerCount = ruleset.maxPlayerCount;
        this.deck = ruleset.getStartDeck();

        this.pile = new card.RegularPile();
        this.score = 0;

        this.hostUser = hostUser;

        this.users = {};
        this.spectators = {};

        this.currentTurnPlayer = null;
        this.round = 1;

        this.turnTimeout = null;

        this._initPlayers(Array.from(users));

        this._initGame();
    }

    _initPlayers(usersArray){
        console.log(usersArray);
        for (var i = 0; i < usersArray.length; i++){
            usersArray[i].gamePlayer = new player.GamePlayer(i, usersArray[i].id, this, player.PLAYER_MODE.PLAYER);
            this.users[i] = usersArray[i];
        }
    }

    _distributeCardsToPlayers(){
        for (let [id, userObj] of Object.entries(this.users)){
            for (var i = 0; i < this.ruleset.startCardsPerPlayer; i++){
                userObj.gamePlayer.hand.addCard(this.deck.getTopCard()); 
            }
        }
    }

    _initGame(){
        this.currentTurnPlayer = 0;
        this._distributeCardsToPlayers();
        // take one card and put it onto the pile to start the game.
        this.pile.placeCard(this.deck.getTopCard());

        CommsManager.CommsManagerInstance.broadcastGameMessage(new messaging.OutgoingMessages.gameStartMessage(this), this);

        for (let [id, userObj] of Object.entries(this.users)){
            userObj.commsClient.sendMessage(new messaging.OutgoingMessages.userGameStateMessage(this, userObj));
        }

    }

    // newSuit is the suit that the player chooses
    makeMove(playerId, card, newSuit=null){
        if (card.type == card.CARD_TYPES.WILD || card.type == CARD.CARD_TYPES.DRAW_4){
            assert (newSuit !== null);
        }


    }

}

var gm = new GameManager();
module.exports = gm;