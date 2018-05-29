var OUTGOING_MESSAGE_TYPE = {
    JOIN_GAME_FAILED: 'join_game_failed',
    PENDING_GAME_STATE: 'pending_game_state',
    PENDING_GAME_RULESET: 'pending_game_ruleset'
}


var ClientMessages = {
    joinGameMessage: function(gameId){
        return {
            type: 'join_game',
            pendingGameId: gameId
        }
    },

    getPendingGameState: function(gameId){
        return {
            type: 'get_pending_game_state',
            pendingGameId: gameId
        }
    },

    getPendingGameRuleset: function(gameId){
        return {
            type: 'get_pending_game_ruleset',
            pendingGameId: gameId
        }
    },

    setGameRuleset: function(gameId, rulesetId, params_obj){
        return {
            type: 'set_pending_game_ruleset',
            rulesetId: rulesetId,
            params: params_obj
        }
    }
}

class WSLocalClient {
    constructor(token){
        this.ws = new WebSocket(getBaseWSURL() + "?token="+token);
        this._bindClientWSEvents(this.ws);
    }

    sendSetGameRuleset(gameId, rulesetId, params_obj){
        this.ws.send(JSON.stringify(new ClientMessages.setGameRuleset(gameId, rulesetId, params_obj)));
    }

    _bindClientWSEvents(socket){
        socket.onopen = function(evt){
            console.log('conn estabed');

            // check if already in game.
            getUserInfo().then(function(result){
                if (result.pendingGameId){
                    window.wsLocalClient.ws.send(JSON.stringify(new ClientMessages.getPendingGameState(result.pendingGameId)));
                    // If you are already in a game lobby there must already be a ruleset, so can afford to make 2 async reqs.
                    window.wsLocalClient.ws.send(JSON.stringify(new ClientMessages.getPendingGameRuleset(result.pendingGameId)));
                }
                else if (result.gamePlayer) {

                }
                else {
                    // check if query string has the gameId
                    let params = (new URL(document.location)).searchParams;
                    // console.log(window.location.search);
                    if (params.has('joinGame')){
                        console.log('trying to join game');
                        window.wsLocalClient.ws.send(JSON.stringify(new ClientMessages.joinGameMessage(params.get('joinGame'))));
                        // client_this.ws.send(JSON.stringify(new ClientMessages.joinGameMessage(params.get('joinGame'))));
                    }
                }
            })


            
        }

        socket.onmessage = function(event){
            var msg = JSON.parse(event.data);
            switch(msg.type){
                /*{
                    
                }*/
                case (OUTGOING_MESSAGE_TYPE.PENDING_GAME_STATE):
                    // update the HTML view of the lobby, ruleset and all.
                    renderPendingGameState($('#players-container'), msg);
                    break;
                
                case (OUTGOING_MESSAGE_TYPE.PENDING_GAME_RULESET):
                    renderCurrentRuleset(msg);
                    break;

            }
        }
    }

}

define({
	WSLocalClient: WSLocalClient,
	ClientMessages: ClientMessages,
	OUTGOING_MESSAGE_TYPE: OUTGOING_MESSAGE_TYPE
})