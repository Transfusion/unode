var assert = require('assert');
var url = require('url');
var jwt = require('jsonwebtoken');

var logger = require('../logging').logger;
var config = require('../config');
var utils = require('../utils');

var UserManager = require('../managers/UserManager');
var GameManager = require('../managers/GameManager');

var WSTransport = require('./WSTransport');

var messaging = require('./Messaging');

/* Simple protocol:

JOIN G
*/

/*TODO: consider using a pub/sub architecture so that the game lobby
can receive updates in realtime, and we can request to subscribe
to the events of any game.*/

class CommsManager {

	static get AVAILABLE_TRANSPORTS(){
		return {
			WEBSOCKET: 'ws'
		}
	}

	constructor(){
		this.transports = {};
	}

	initWSTransport(serv){
		this.transports[CommsManager.WEBSOCKET] = new WSTransport(serv);
	}

	// user is user object from UserManager
	connect(user, client){
		user.commsClient = client;
	}

	disconnect(user, client){
		user.commsClient = null;
	}

	// methods with transport-independent implementations are below
	broadcastGameMessage(msg, game){
		// let stringifiedMessage = JSON.stringify(msg);
		/*Object.entries(game.users).forEach(function([playerId, userObj]){
			userObj.commsClient.sendMessage(stringifiedMessage);
		});*/

		for (let [id, userObj] of Object.entries(game.users)){
			userObj.commsClient.sendMessage(msg);
		}
	}

	broadcastPendingGameMessage(msg, pendingGame){
		// let stringifiedMessage = JSON.stringify(msg);
		pendingGame.pendingUsers.forEach(function(pendingUser){
			pendingUser.commsClient.sendMessage(msg);
		});
	}

	// sendMessage(user){

	// }

	_joinGame(msg){
		if (msg.commsClient.userObj.inPendingGame || msg.commsClient.userObj.inGame){
			throw new Error('Already in or waiting for game');
		}
		var game = GameManager.getPendingGame(msg.pendingGameId);
		game.joinUser(msg.commsClient.userObj);
	}

	_leaveGame(msg){
		if (msg.commsClient.userObj.inPendingGame){
			var game = GameManager.getPendingGame(msg.commsClient.userObj.pendingGameId);
			// console.log('watapak '+ msg.commsClient.userObj.id);
			game.leaveUser(msg.commsClient.userObj);
		}
		else if (msg.commsClient.userObj.inGame){

		}
		else {

		}
	}

	_setPendingGameRuleset(msg){
		var pendingGame = GameManager.getPendingGame(msg.commsClient.userObj.pendingGameId);
		pendingGame.setRuleset(msg.params, msg.commsClient.userObj);
	}

	_startGame(msg){
		var pendingGame = GameManager.getPendingGame(msg.commsClient.userObj.pendingGameId);
		pendingGame.initGame(msg.commsClient.userObj);
	}

	// msg is a JSON object
	processMessage(msg){
		switch(msg.type){

			/*{
				type: 'join_game',
				pendingGameId: 'xxx-xxx-xxx',
				commsClient: [added in the WSClient]

			}*/
			case ('join_game'):
				try {
					this._joinGame(msg);
				}
				catch (error){
					logger.error(error);
					msg.commsClient.sendMessage(
						new messaging.OutgoingMessages.errorMessage('Unable to join ' + msg.pendingGameId + ': ' + error));
				}
				
				break;
				
			case ('leave_game'):
				try {
					this._leaveGame(msg);
				}
				catch (error){
					logger.error(error);
				}
				break;

			case ('get_pending_game_state'):
				try {
					var game = GameManager.getPendingGame(msg.pendingGameId);
					msg.commsClient.sendMessage(new messaging.OutgoingMessages.pendingGameStateMessage(game, msg.commsClient.userObj, msg.syncId));
				}
				catch (error){
					logger.error(error);
					msg.commsClient.sendMessage(
						new messaging.OutgoingMessages.errorMessage('Unable to get state of ' + msg.pendingGameId + ': ' + error));
				}
				break;
			/*{
				type: 'get_pending_game_ruleset',
				pendingGameId: 'xxx-xxx-xxx',
				commsClient: [added in the WSClient]
			}*/
			case ('get_pending_game_ruleset'):
				try {
					var game = GameManager.getPendingGame(msg.pendingGameId);
					msg.commsClient.sendMessage(new messaging.OutgoingMessages.pendingGameRulesetMessage(game, msg.syncId));
				}
				catch (error){
					logger.error(error);
					msg.commsClient.sendMessage(
						new messaging.OutgoingMessages.errorMessage('Unable to get ruleset of ' + msg.pendingGameId));
				}
				break;

			case ('set_pending_game_ruleset'):
				try {
					this._setPendingGameRuleset(msg);
				}
				catch (error){
					logger.error(error);
					msg.commsClient.sendMessage(
						new messaging.OutgoingMessages.errorMessage('Unable to join ' + msg.pendingGameId + ': ' + error));
				}
				break;
			
			case ('start_game'):
				try {
					this._startGame(msg);
				}
				catch (error){
					logger.error(error);
					msg.commsClient.sendMessage(
						new messaging.OutgoingMessages.errorMessage('Unable to start ' + msg.pendingGameId + ': ' + error));
				}

				break;

			case ('get_pending_games_list'):
				// try {
				msg.commsClient.sendMessage(
					new messaging.OutgoingMessages.pendingGamesListMessage(GameManager.getPendingGames(), msg.syncId));
				// }
				break;


			case ('heartbeat_client'):
				// console.log('fdgsdfg')
				msg.commsClient.sendMessage(
					new messaging.OutgoingMessages.heartbeatClientPongMessage());
				break;

		}
	}


}

/*var COMMANDS_LIST=  {
	"CONNECT": 
}
*/

// module.exports.bindWSEvents = bindWSEvents;
module.exports.CommsManagerInstance = new CommsManager();
// module.exports.CommsClient = CommsClient;
