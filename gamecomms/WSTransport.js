var url = require('url');
var jwt = require('jsonwebtoken');
var ws = require('ws').Server;

var config = require('../config');
var CommsManager = require('./CommsManager');
var UserManager = require('../managers/UserManager');

var CommsClientInterface = require('./CommsClientInterface');

var logger = require('../logging').logger;

class WebSocketTransport {

	/*_decodeMessage(msg){

	}*/
	
	_validateOrigin(origin){
		return true;	
	}

	constructor(serv){
		this.wsserv = new ws({server: serv});
		this._bindWSEvents(this.wsserv);
	}

	_bindWSEvents(wsserv){
		wsserv.on('connection', function(ws, req){
			// console.log(wsserv.upgradeReq.url);
			/*if (!_validateOrigin()){

			}*/

			console.log(req.url);

			// https://stackoverflow.com/questions/8590042/parsing-query-string-in-node-js
			var queryParams = url.parse(req.url, true).query;
			try {
				var token = jwt.verify(queryParams['token'], config.app.jwt_shared_secret);
					// consol
				var userObj = UserManager.getUser(token['userId']);
				// ws.user = userObj;
				var wsClient = new WSClient(userObj, ws, this._decodeMessage);
				CommsManager.CommsManagerInstance.connect(userObj, wsClient);
			}
			catch (error) {
				logger.error(error);
				ws.close();
				return
			}

		})
	}
}

class WSClient extends CommsClientInterface {
	constructor(userObj, ws_socket, decodeMessageFunc){
		super();
		this.userObj = userObj;
		this.socket = ws_socket;
		this._decodeMessage = decodeMessageFunc;
		this._bindWSSocketEvents(this.socket);
	}

	_bindWSSocketEvents(ws){
		var client_this = this;
		ws.on('message', function(data){
			try {
				var msgPOJO = JSON.parse(data);
				// CommsManager.CommsManagerInstance.processMessage(this._decodeMessage(data));
				msgPOJO.commsClient = client_this;
				logger.info('received from ws endpoint ' + data);
				CommsManager.CommsManagerInstance.processMessage(msgPOJO);
			}
			catch(error){
				logger.error(error);
				logger.info('unable to decode ' + data);
			}
		})

		ws.on('close', function(code, reason){
			
		})
	}

	get clientType(){
		return CommsManager.CommsManager.AVAILABLE_TRANSPORTS.WEBSOCKET;
	}

	/*get userObj(){
		return this.userObj;
	}*/

	sendMessage(message){
		var msg = JSON.stringify(message);
		/*console.log('sent');
		console.log(msg)*/
		try {
			this.socket.send(msg);	
		}
		catch (error){
			logger.error(error);
			// this.sendMessage(message);
		}
	}

}

module.exports = WebSocketTransport;