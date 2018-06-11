
define(['wsclient_messages', 'game_browser_render_utils'], function(wsclient_messages, game_browser_render_utils){

    class WSLocalClient {
        constructor(token){
            this._jwtToken = token;
            this._preInit();
        }

        _preInit(){
            this.ws = new WebSocket(getBaseWSURL() + "?token="+this._jwtToken);
            this.wsSynchronousCallbacks = {};
            this.missedHeartbeats = 0;
            this._bindClientWSEvents(this.ws);
        }

        _startWSHeartbeat(){
            var client_this = this;
            this.heartbeatInterval = setInterval(function(){
                try {
                    client_this.missedHeartbeats++;
                    if (client_this.missedHeartbeats >= MAX_MISSED_HEARTBEATS){
                        throw new Error('Too many missed heartbeats');
                    }
                    client_this.ws.send(JSON.stringify(wsclient_messages.ClientMessages.heartbeatClient()));
                }
                catch (error){
                    console.log(error);
                    clearInterval(client_this.heartbeatInterval);
                    clearInterval(ClientMessages.gamebrowserInterval);
                    client_this.ws.close();
                }

            }, HEARTBEAT_INTERVAL);
        }

        _sendPendingGamesListReq(client_this){
            var unqStr = uniqueString();
            client_this.wsSynchronousCallbacks[unqStr] = function(msg){
                game_browser_render_utils.pendingGameListCb(msg.games);
                for (let id of msg.games){
                    unqStr = uniqueString();
                    client_this.wsSynchronousCallbacks[unqStr] = function(msg){
                        unqStr = uniqueString();
                        client_this.wsSynchronousCallbacks[unqStr] = function(msg_ruleset){
                            game_browser_render_utils.renderPendingGame(msg, msg_ruleset);
                        } 
                        client_this.ws.send(JSON.stringify(wsclient_messages.ClientMessages.getPendingGameRuleset(id, unqStr)));       
                    }
                    client_this.ws.send(JSON.stringify(wsclient_messages.ClientMessages.getPendingGameState(id, unqStr)));
                }
            }
            client_this.ws.send(JSON.stringify(wsclient_messages.ClientMessages.getPendingGamesList(unqStr)));
        }
        
        // Periodically refreshes the list of available games to join
        _startGameBrowserLoop(){
            var client_this = this;
            // client_this.ws.send(JSON.stringify(wsclient_messages.ClientMessages.getPendingGamesList(uniqueString())));
            this._sendPendingGamesListReq(this);
            this.gamebrowserInterval = setInterval(function(){client_this._sendPendingGamesListReq(client_this)}, 10000);
        }

        /*sendPendingGameStateMessage(pendingGameId){
            this.ws.send(JSON.stringify(new wsclient_messages.ClientMessages.getPendingGameState(pendingGameId, uniqueString())));
        }*/

        _bindClientWSEvents(socket){
            var client_this = this;

            socket.onopen = function(evt){
                console.log('conn estabed');
                client_this._startWSHeartbeat();
                client_this._startGameBrowserLoop();
                game_browser_render_utils.hideReconnectingModal();
            }

            socket.onmessage = function(event){
                var msg = JSON.parse(event.data);
                // console.log(msg);

                if (msg.syncId){
                    var func = client_this.wsSynchronousCallbacks[msg.syncId];
                    delete client_this.wsSynchronousCallbacks[msg.syncId];

                    func(msg);
                    return
                }

                switch(msg.type){
                    case (wsclient_messages.OUTGOING_MESSAGE_TYPE.HEARTBEAT_CLIENT_PONG):
                        client_this.missedHeartbeats = 0;
                        break;

                    // TODO: make game browser updates appear asynchronously.
                    case (wsclient_messages.OUTGOING_MESSAGE_TYPE.PENDING_GAMES_LIST):
                        // game_browser_render_utils.renderPendingGamesList(msg.games);
                        break;

                    case (wsclient_messages.OUTGOING_MESSAGE_TYPE.PENDING_GAME_STATE):
                        // game_browser_render_utils.renderPendingGameState(msg);
                        break;

                }

            }

            socket.onerror = function(event){
                // console.log('ancokaksdfo')
            }

            socket.onclose = function(event){
                game_browser_render_utils.showReconnectingModal();
                setTimeout(client_this._preInit, RECONNECT_WAIT_INTERVAL);
            }
        }

    }


    return {
        WSLocalClient: WSLocalClient
    };

});