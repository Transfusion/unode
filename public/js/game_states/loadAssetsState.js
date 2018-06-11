
var loadAssetsState = function(game){}
loadAssetsState.prototype = {
    init: function(){
        // console.log(this.game.height);
    },

    preload: function(){
        console.log(this.game.data.client_card);

        // require(['client_pojos/client_card'], function(client_card){
        //     console.log(client_card.CARD_TYPES)
            // this.game.load.image('testCard', '/card_sprites/default?type=back_alt'); 

        this.preloadBar = this.add.sprite( (this.game.width-311)/2, (this.game.height-27)/2, 'loadingBar');
        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('card_back_alt_large', '/card_sprites/default?type=back_alt'); 
        this.load.image('card_back_large', '/card_sprites/default?type=back'); 

        
        for (let [key, number] of Object.entries(this.game.data.client_card.CARD_NUMBERS)){
            // add all the numbered cards
            for (let [key, color] of Object.entries(this.game.data.client_card.CARD_COLORS)){
                this.load.image(this.game.data.client_card.getCardSpriteName(this.game.data.client_card.CARD_TYPES.REGULAR, color, number),
                    'card_sprites/default?' + createQueryString({
                        'type': this.game.data.client_card.CARD_TYPES.REGULAR,
                        'color': color,
                        'number': number
                    }));
            }
        }

        for (let [key, color] of Object.entries(this.game.data.client_card.CARD_COLORS)){
            this.load.image(this.game.data.client_card.getCardSpriteName(this.game.data.client_card.CARD_TYPES.REVERSE, color),
                'card_sprites/default?' + createQueryString({
                    'type': this.game.data.client_card.CARD_TYPES.REVERSE,
                    'color': color
                }));

            this.load.image(this.game.data.client_card.getCardSpriteName(this.game.data.client_card.CARD_TYPES.SKIP, color),
                'card_sprites/default?' + createQueryString({
                    'type': this.game.data.client_card.CARD_TYPES.SKIP,
                    'color': color
                }));

            this.load.image(this.game.data.client_card.getCardSpriteName(this.game.data.client_card.CARD_TYPES.DRAW_2, color),
                'card_sprites/default?' + createQueryString({
                    'type': this.game.data.client_card.CARD_TYPES.DRAW_2,
                    'color': color
                }));
        }

        this.load.image(this.game.data.client_card.getCardSpriteName(this.game.data.client_card.CARD_TYPES.WILD),
                'card_sprites/default?' + createQueryString({
                    'type': this.game.data.client_card.CARD_TYPES.WILD
                }));

        this.load.image(this.game.data.client_card.getCardSpriteName(this.game.data.client_card.CARD_TYPES.DRAW_4),
                'card_sprites/default?' + createQueryString({
                    'type': this.game.data.client_card.CARD_TYPES.DRAW_4
                }));


        this.load.image('call_uno_btn', '/misc_sprites/call_uno.png');
        this.load.image('call_out_btn', '/misc_sprites/call_out.png');

        this.load.image('fullscreen_toggle', '/misc_sprites/fullscreen-toggle.png');        
        this.load.image('transparent_100x100', '/misc_sprites/transparent_100x100.png');

        // load all the player avatars
        var state_this = this;
        getAvatarsInfo().then(function(result){
            for (let [key, obj] of Object.entries(result)){
                // console.log([key, obj])
                state_this.load.image(obj, getAvatarsURL() + '/' + key);
            }
        });

    },

    create: function() {
        // this.game.state.start('establishServerConn');
        this.game.state.start('mockupState');

        // Establish connection with the game server, game_wsclient will trigger the lobby.
        /*$('#lobbyModal').modal({
            keyboard: false,
            backdrop: 'static',
            show: true
        });
        this.game.data.initWSClient();*/
    },

    update: function() {

    }
}

define('game_states/loadAssetsState', function(){
    return loadAssetsState;
    // return loadAssetsStateWrapper;
})