
define(['wsclient_messages', 'game_lobby_render_modal'], function(wsclient_messages, game_lobby_render_modal){

    class WSLocalClient {
        constructor(token){
            this.token = token;
            this._preInit();
        }

        _preInit(){
            this.ws = new WebSocket(getBaseWSURL() + "?token="+this.token);
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

        sendSetGameRuleset(gameId, rulesetId, params_obj){
            this.ws.send(JSON.stringify(new wsclient_messages.ClientMessages.setGameRuleset(gameId, rulesetId, params_obj)));
        }

        sendLeaveGameMessage(){
            this.ws.send(JSON.stringify(new wsclient_messages.ClientMessages.leaveGameMessage()));
        }

        sendStartGameMessage(pendingGameId){
            this.ws.send(JSON.stringify(new wsclient_messages.ClientMessages.startGameMessage(pendingGameId)));
        }

        _bindClientWSEvents(socket){
            var client_this = this;

            socket.onopen = function(evt){
                console.log('conn estabed');
                client_this._startWSHeartbeat();

                // check if already in game.
                getUserInfo().then(function(result){
                    if (result.pendingGameId){
                        window.wsLocalClient.ws.send(JSON.stringify(new wsclient_messages.ClientMessages.getPendingGameState(result.pendingGameId)));
                        // If you are already in a game lobby there must already be a ruleset, so can afford to make 2 async reqs.
                        window.wsLocalClient.ws.send(JSON.stringify(new wsclient_messages.ClientMessages.getPendingGameRuleset(result.pendingGameId)));
                    }
                    else if (result.gamePlayer) {

                    }
                    else {
                        // check if query string has the gameId
                        let params = (new URL(document.location)).searchParams;
                        if (params.has('joinGame')){
                            console.log('trying to join game');
                            window.wsLocalClient.ws.send(JSON.stringify(new wsclient_messages.ClientMessages.joinGameMessage(params.get('joinGame'))));
                            // client_this.ws.send(JSON.stringify(new wsclient_messages.ClientMessages.joinGameMessage(params.get('joinGame'))));
                        }
                    }
                })

                hideReconnectingModal();
            }

            socket.onmessage = function(event){
                var msg = JSON.parse(event.data);

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

                    case (wsclient_messages.OUTGOING_MESSAGE_TYPE.PENDING_GAME_STATE):
                        // update the HTML view of the lobby, ruleset and all.
                        renderPendingGameState($('#players-container'), msg);
                        break;
                    
                    case (wsclient_messages.OUTGOING_MESSAGE_TYPE.PENDING_GAME_RULESET):
                        renderCurrentRuleset(msg);
                        break;

                    case (wsclient_messages.OUTGOING_MESSAGE_TYPE.PENDING_GAME_READY_START_STATUS):
                        var unqStr = uniqueString();
                        // send a pending_game_state message, check if we are the host
                        getUserInfo().then(function(result){
                            client_this.wsSynchronousCallbacks[unqStr] = function(cb_msg){
                                if (cb_msg.host === result.id && msg.ready){
                                    setStartGameBtnEnabled(true);
                                }
                                else {
                                    setStartGameBtnEnabled(false);    
                                }
                            };
                            client_this.ws.send(JSON.stringify(new wsclient_messages.ClientMessages.getPendingGameState(result.pendingGameId, unqStr)));
                        });
                        break;
                    
                    case (wsclient_messages.OUTGOING_MESSAGE_TYPE.JOIN_PENDING_GAME_SUCCESS):
                        // don't want to double render our own joins
                        getUserInfo().then(function(result){
                            if (msg.userId !== result.id){
                                renderPlayerJoin($('#players-container'), msg);
                            } 
                        })
                        
                        break;

                    case (wsclient_messages.OUTGOING_MESSAGE_TYPE.LEAVE_PENDING_GAME_SUCCESS):
                        getUserInfo().then(function(result){
                            if (result.id === msg.userId){
                                window.location.href = '/';
                            }
                            else {
                                renderPlayerLeave($('#players-container'), msg);
                            }
                        });
                        break;

                    case (wsclient_messages.OUTGOING_MESSAGE_TYPE.PENDING_GAME_DESTROYED):
                        window.location.href = '/';
                        break;

                    case (wsclient_messages.OUTGOING_MESSAGE_TYPE.PENDING_GAME_TIMEOUT):
                        renderPendingGameTimeout(msg);
                        break;



                    case (wsclient_messages.OUTGOING_MESSAGE_TYPE.GAME_START):
                        hideLobbyModal();

                        // https://photonstorm.github.io/phaser-ce/Phaser.StateManager.html#start
                        /*var phaserGameState = window.game.state.getCurrentState();
                        console.log(phaserGameState.key);
                        console.assert(phaserGameState.key == 'inGame');
                        phaserGameState.testRender();*/
                        break;

                    case (wsclient_messages.OUTGOING_MESSAGE_TYPE.USER_GAME_STATE):
                        window.game.state.start('inGame', true, false, msg);
                        break;
                }
            }

            socket.onclose = function(event){
                showReconnectingModal();
                setTimeout(client_this._preInit, RECONNECT_WAIT_INTERVAL);
            }
        }
        
    }



    return {
        WSLocalClient: WSLocalClient
    };

});