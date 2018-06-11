var uuid = require('uuid/v1');
var jwt = require('jsonwebtoken');
var config = require('../config');

var GameManager = require('./GameManager');

class User {
	constructor(username, tripcode, id, avatar){
		this.username = username;
		this.tripcode = tripcode;
		this.id = id;
		this.avatar = avatar;

		this.pendingGameId = null;

		// gamePlayer is the object defined in player.js
		this.gamePlayer = null;
		// commsClient is used for realtime game interaction(spectating or playing)
		this.commsClient = null;
		// console.log(this.generateWSToken());
	}
	
	// set gamePlayer(gamePlayer){
	// 	this.gamePlayer = gamePlayer;
	// }

	get inGame(){
		return !(this.gamePlayer === null);
	}

	get inPendingGame(){
		return !(this.pendingGameId === null);
	}

	generateWSToken(){
		var token = jwt.sign({'userId': this.id}, config.app.jwt_shared_secret);
		return token; // is a string
	}

	toJSON(){
		var jsonRep = {
			'id': this.id,
			'username': this.username,
			'tripcode': this.tripcode,
			'avatar': this.avatar,
			'pendingGameId': this.pendingGameId,
			'gamePlayer': !this.gamePlayer ? null : this.gamePlayer
			// 'pendingGameAmHost': !this.pending_game_am_host ? this.pending_game_am_host : undefined
		}

		/*if (this.inPendingGame){
			jsonRep['pendingGameAmHost'] = (GameManager.getPendingGame(this.pendingGameId).hostUser.id == this.id)
		}*/
		console.log(jsonRep);
		return jsonRep;
	}
}

// var ADDUSER_STATUS = {
// 	SUCCESS: 0,
// 	EXISTS: 1,
// 	FAILED: 2,
// }

class UserManager {
	constructor(){
		// map of userID to user object
		this.users = {};
	}

	addUser(username, tripcode, avatar){
		/*for (var user in Object.entries(this.users)){
			if (username === user.username && tripcode === user.tripcode){
				return false;
			}
		}*/
		
		var uniqId = uuid();
		var newUser = new User(username, tripcode, uniqId, avatar);
		this.users[uniqId] = newUser;
		return newUser;
	}

	delUser(id){
		delete this.users[id];
	}

	getUser(id){
		if (id === "test1"){
			return {
				"id":"test1",
				"username":"testUser1",
				"tripcode":"mockup",
				"avatar":"4",
				"pendingGameId":null,
				"gamePlayer":null
			};

		}

		if (id === "test2"){
			return {
				"id":"test2",
				"username":"testUser2",
				"tripcode":"mockup2",
				"avatar":"1",
				"pendingGameId":null,
				"gamePlayer":null
			};

		}

		return this.users[id];
	}
}

// module.exports.ADDUSER_STATUS = ADDUSER_STATUS;
var um = new UserManager();
module.exports = um;
