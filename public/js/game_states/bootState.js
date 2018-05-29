var bootState = function(game){}
bootState.prototype = {
    init: function(){
        
    },
    
    preload: function(){
        // this.game.load.image('testCard', '/card_sprites/default?type=back_alt'); 
        this.game.load.image('loadingBar', '/misc_sprites/loading-bar.png')
    },
    create: function() {
       /* this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        spr = this.game.add.sprite(0,0,'testCard');
        // bmpText = game.add.bitmapText(0, 0, 'carrier_command','Drag me around !',);
        var text = "- phaser -\n with a sprinkle of \n pixi dust.";
        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

        var t = this.game.add.text(this.game.world.centerX-300, 0, text, style);*/

        this.input.maxPointers = 1;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.state.start('loadAssets');
    },

    update: function() {

    }
}

define('game_states/bootState', function(){
    return bootState;
})