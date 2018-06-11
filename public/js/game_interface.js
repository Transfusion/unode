// var config = { 
//     preload: preload, 
//     create: create, 
//     update: update 
// }

require(['game_interface_wsclient', 'game_states/bootState', 'game_states/loadAssetsState', 'game_states/inGameState', 'game_states/mockupState',
        'client_pojos/client_card'], 
        
function(game_wsclient, bootState, loadAssetsState, inGameState, mockupState, client_card){

    function initWSClient(){
        $.get('/api/ws_token').done(function(data){
            if ('token' in data){
                window.wsLocalClient = new game_wsclient.WSLocalClient(data['token']);
            }
            else {
                console.log(data);    
            }
        }).fail(function(data){
            console.log('failed to obtain ws token');
        })
    }

    // console.log(game_wsclient);
    
    function populateStates(){
        window.game.state.add('boot', bootState);
        window.game.state.add('loadAssets', loadAssetsState);
        // window.game.state.add('establishServerConn', establishServerConnState);
        window.game.state.add('inGame', inGameState);
        window.game.state.add('mockupState', mockupState);
    }

    function setGlobalVariables(){
        window.game.data = {};
        window.game.data.client_card = client_card;

        window.game.data.initWSClient = initWSClient;
    }


    require(['domReady'], function (domReady) {
        domReady(function () {
            console.log('Game Interface DOM Ready');
            spaceBelowNavbar();

            /*$('#lobbyModal').modal({
                keyboard: false,
                backdrop: 'static',
                show: true
            });*/
            
            getUserInfo().then(function(result){
                window.userInfo = result;
                initProfileWidget($('#profile-container'));
            })

            getRulesetInfo().then(function(result){
                window.rulesetInfo = result;
                populateRulesetSelector($('#ruleset-selector'));
                loadRulesetParameters($('#ruleset-parameters-block'), $('#ruleset-selector'));
                // declared in game_lobby_render_modal.js
                bindRulesetFormSubmit();
            })
            
            // initWSClient();

            bindPendingGameLeaveBtn();
            bindStartGameBtn();
            
            // console.log(Phaser);
            window.game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');
                        
            populateStates();
            setGlobalVariables();

            game.state.start('boot');
            // game.state.start('')
            // initWSClient();
        });
    });


});


// var OUTGOING_MESSAGE_TYPE = {
//     PENDING_GAME_STATE: 'pending_game_state'
// }


// var ClientMessages = {
//     joinGameMessage: function(gameId){
//         return {
//             type: 'join_game',
//             pendingGameId: gameId
//         }
//     }
// }

// class WSLocalClient {
//     constructor(token){
//         this.ws = new WebSocket(getBaseWSURL() + "?token="+token);
//         this._bindClientWSEvents(this.ws);
//     }

//     _bindClientWSEvents(socket){
//         socket.onopen = function(evt){
//             console.log('conn estabed');
//             // check if query string has the gameId
//             let params = (new URL(document.location)).searchParams;
//             // console.log(window.location.search);
//             if (params.has('joinGame')){
//                 console.log('trying to join game');
//                 window.wsLocalClient.ws.send(JSON.stringify(new ClientMessages.joinGameMessage(params.get('joinGame'))));
//             }
//         }

//         socket.onmessage = function(event){
//             var msg = JSON.parse(event.data);
//             switch(msg.type){
//                 case (OUTGOING_MESSAGE_TYPE.PENDING_GAME_STATE):
//                     window.game.state.start('establishServerConn');
//                     break;
//             }
//         }
//     }

// }

// window.onload = function(){
//     initWSClient();

//     window.game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');
//     window.game.state.add('establishServerConn', establishServerConn);
//     // game.state.start('establishServerConn');
// }


// var establishServerConn = function(game){}
// establishServerConn.prototype = {
//     preload: function(){
//         this.game.load.image('testCard', '/card_sprites/default?type=back_alt'); 
//     },
//     create: function() {
//         this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
//         spr = this.game.add.sprite(0,0,'testCard');
//         // bmpText = game.add.bitmapText(0, 0, 'carrier_command','Drag me around !',);
//         var text = "- phaser -\n with a sprinkle of \n pixi dust.";
//         var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

//         var t = this.game.add.text(this.game.world.centerX-300, 0, text, style);
//     },

//     update: function() {

//     }
// }
