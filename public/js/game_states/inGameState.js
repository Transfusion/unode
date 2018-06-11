var inGameState = function(game){}
inGameState.prototype = {

    _renderCard(card_pojo, posX, posY, width){
        var card_sprite_key = this.game.data.client_card.getCardSpriteName(card_pojo.type, card_pojo.color, card_pojo.number);
        var card = game.add.sprite(posX, posY, card_sprite_key);
        card.width = width;
        card.scale.y = card.scale.x;
        console.log(card.scale);
        
    },

    _renderOwnHand: function(hand){
        // calculate the positioning at the bottom
        var card = hand[0];
        this._renderCard(card, 0, 0, 50);
    },

    _renderGameState: function(game_state_msg){
        this._renderOwnHand(game_state_msg.myHand.cards);
    },

    _renderFullScreenToggle: function(){
        var toggleBtn = game.add.sprite(this.game.width-70, 20, 'fullscreen_toggle');
        toggleBtn.width = 50;
        toggleBtn.scale.y = toggleBtn.scale.x;
    },

    preload: function(){
        // this.game.load.image('testCard', '/card_sprites/default?type=back_alt'); 
    },

    init: function(game_state_msg){
        console.log(game_state_msg);
        this._renderFullScreenToggle();
        this._renderGameState(game_state_msg);
    },

    create: function() {
        
    },

    testRender: function(){
        spr = this.game.add.sprite(0,0,'card_back_large');
        // bmpText = game.add.bitmapText(0, 0, 'carrier_command','Drag me around !',);
        var text = "- phaser -\n with a sprinkle of \n pixi dust.";
        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

        var t = this.game.add.text(this.game.world.centerX-300, 0, text, style);
    },

    update: function() {

    }
}

define('game_states/inGameState', function(){
	return inGameState;
});