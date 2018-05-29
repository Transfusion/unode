var hand = require('./hand');

var PLAYER_MODE {
    SPECTATOR: 1,
    PLAYER: 2,
 }

class GamePlayer {
    constructor(id, game, mode){
        this.id = id;
        this.game = game;
        this.mode = mode;
        if (this.mode === PLAYER_MODE.PLAYER){
            this.hand = new Hand();
        }
        else {
            this.hand = null;
        }
        this.inGame = true;

    }
}


module.exports.Player = GamePlayer