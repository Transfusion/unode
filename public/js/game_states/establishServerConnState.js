var establishServerConnState = function(game){}
establishServerConnState.prototype = {
    preload: function(){
        // this.game.load.image('testCard', '/card_sprites/default?type=back_alt'); 
    },
    create: function() {
        spr = this.game.add.sprite(0,0,'card_back_large');
        // bmpText = game.add.bitmapText(0, 0, 'carrier_command','Drag me around !',);
        var text = "- phaser -\n with a sprinkle of \n pixi dust.";
        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

        var t = this.game.add.text(this.game.world.centerX-300, 0, text, style);
    },

    update: function() {

    }
}

define('game_states/establishServerConnState', function(){
	return establishServerConnState;
});