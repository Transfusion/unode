
/*var OUTGOING_MESSAGE_TYPE = {
	PENDING_GAMES_LIST: 'pending_games_list',

	JOIN_PENDING_GAME_SUCCESS: 'join_pending_game_success',
	JOIN_PENDING_GAME_FAILED: 'join_pending_game_failed',

	LEAVE_PENDING_GAME_SUCCESS: 'leave_pending_game_success',
	LEAVE_PENDING_GAME_FAILED: 'leave_pending_game_failed',

	// synchronous option
	PENDING_GAME_STATE: 'pending_game_state',
	// synchronous option
	PENDING_GAME_RULESET: 'pending_game_ruleset',

	// when a pending game is destroyed without having started a full game
	PENDING_GAME_DESTROYED: 'pending_game_destroyed',

	HEARTBEAT_CLIENT_PONG: 'heartbeat_client_pong'
}
*/

/*function _serializeRuleset(ruleSet){

}*/

const OUTGOING_MESSAGE_TYPE = require('./MessagingTypes');

var OutgoingMessages = {
	errorMessage: function(text){
		return {
			'error': text
		}
	},

	pendingGamesListMessage: function(games_obj, syncId=undefined){
		/*for (let [key, obj] of games_obj){
			
		}*/
		var msg = {
			type: OUTGOING_MESSAGE_TYPE.PENDING_GAMES_LIST,
			games: Object.keys(games_obj)
		}
		if (syncId){
			msg.syncId = syncId;
		}
		return msg;
	},

	joinPendingGameFailedMessage: function(pendingGame, reason_str){
		var msg = {};
		msg.type = OUTGOING_MESSAGE_TYPE.JOIN_PENDING_GAME_FAILED;
		msg.pendingGameId = pendingGame.id;
		msg.reason = reason_str;
		return msg;
	},

	joinPendingGameSuccessMessage: function(pendingGame, User){
		return {
			type: OUTGOING_MESSAGE_TYPE.JOIN_PENDING_GAME_SUCCESS,
			pendingGameId: pendingGame.id,
			userId: User.id
		}
	},


	leavePendingGameFailedMessage: function(pendingGame, reason_str){
		var msg = {
			type: OUTGOING_MESSAGE_TYPE.LEAVE_PENDING_GAME_FAILED,
			pendingGameId: pendingGame.id,
			reason: reason_str
		};
		return msg;
	},

	leavePendingGameSuccessMessage: function(pendingGame, User){
		var msg = {
			type: OUTGOING_MESSAGE_TYPE.LEAVE_PENDING_GAME_SUCCESS,
			pendingGameId: pendingGame.id,
			userId: User.id
		};
		return msg;
	},

	pendingGameDestroyedMessage: function(pendingGame){
		return {
			type: OUTGOING_MESSAGE_TYPE.PENDING_GAME_DESTROYED,
			pendingGameId: pendingGame.id
		}
	},

	pendingGameReadyStartStatusMessage: function(pendingGame, ready=false){
		return {
			type: OUTGOING_MESSAGE_TYPE.PENDING_GAME_READY_START_STATUS,
			pendingGameId: pendingGame.id,
			ready: ready
		}
	},

	pendingGameStateMessage: function(pendingGame, targetUser, syncId=undefined){
		var msg = {};
		// msg.ruleSet = 
		msg.type = OUTGOING_MESSAGE_TYPE.PENDING_GAME_STATE;
		msg.pendingGameId = pendingGame.id;
		msg.timeout = pendingGame.timeout;
		msg.host = pendingGame.hostUser.id;
		msg.isReadyToStart = pendingGame.isReadyToStart;
		msg.canJoin = pendingGame.canJoin;

		msg.users = [];
		pendingGame.pendingUsers.forEach(function(element){
			msg.users.push(element.id);
		});

		if (syncId){
			msg.syncId = syncId;
		}

		return msg;
	},

	pendingGameRulesetMessage: function(pendingGame, syncId=undefined){
		var msg = {};
		msg.type = OUTGOING_MESSAGE_TYPE.PENDING_GAME_RULESET;
		msg.pendingGameId = pendingGame.id;

		msg.key = pendingGame.ruleset.constructor.name;
		msg.parameters = {}
		for (let [key, obj] of Object.entries(pendingGame.ruleset.params)){

			msg.parameters[key] = obj.value;
		}
		if (syncId){
			msg.syncId = syncId;
		}		

		return msg;
	},

	heartbeatClientPongMessage: function(){
		var msg = {};
		msg.type = OUTGOING_MESSAGE_TYPE.HEARTBEAT_CLIENT_PONG;
		return msg;
	},

	pendingGameTimeoutMessage: function(pendingGame){
		return {
			type: OUTGOING_MESSAGE_TYPE.PENDING_GAME_TIMEOUT,
			timeout: pendingGame.timeout,
			pendingGameId: pendingGame.id
		}
	},

	gameStartMessage: function(game){
		return {
			type: OUTGOING_MESSAGE_TYPE.GAME_START,
			gameId: game.id
		}
	},

	// from the perspective of a user
	userGameStateMessage: function(game, User){
		var id = User.gamePlayer.id;

		var msg = {
			type: OUTGOING_MESSAGE_TYPE.USER_GAME_STATE
		};
		msg.myHand = User.gamePlayer.hand;
		msg.lastPlayedCard = game.pile.topCard();

		/*msg.playersAndCards = {};

		for (let [id, gameUser] of Object.entries(game.users)){
			msg.playersAndCards[gameUser.gamePlayer.id] = gameUser.gamePlayer.hand.numberOfCards;
		}*/

		

		msg.currentTurnPlayer = game.currentTurnPlayer;
		msg.turnTimeout = game.turnTimeout;
		msg.round = game.round;
		msg.score = User.gamePlayer.score;
		return msg;
	},

	unoMessage: function(game, User){
		return {
			type: OUTGOING_MESSAGE_TYPE.UNO,
			gameId: game.id,
			playerId: User.gamePlayer.id,

		}
	},

	globalGameStateMessage: function(game){

	}

	/*gameStateMessage: function(game){
		return {
			type: OUTGOING_MESSAGE_TYPE.GAME_STATE,
			gameId: game.id,

			cardsInDeck: 

		}
	}*/
}

// module.exports.OUTGOING_MESSAGE_TYPE = OUTGOING_MESSAGE_TYPE;
module.exports.OutgoingMessages = OutgoingMessages;