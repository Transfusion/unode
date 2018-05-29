
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
                    'card_sprites/default?'+createQueryString({
                        'type': this.game.data.client_card.CARD_TYPES.REGULAR,
                        'color': color,
                        'number': number
                    }));
            }
        }


            // for (var i = 0; i < 100000; i++){
            //     this.load.image('testCard', '/card_sprites/default?type=back_alt'); 
            // }
        // })
        
    },
    create: function() {
        // this.game.state.start('establishServerConn');
        // Establish connection with the game server, game_wsclient will trigger the lobby.
        this.game.data.initWSClient();
    },

    update: function() {

    }
}

define('game_states/loadAssetsState', function(){
    return loadAssetsState;
    // return loadAssetsStateWrapper;
})