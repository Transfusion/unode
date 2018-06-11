var hand = require('./hand');

var PLAYER_MODE = {
    SPECTATOR: 1,
    PLAYER: 2,
 }

class GamePlayer {
    constructor(id, userId, game, mode){
        this.id = id;
        this.userId = userId;
        this.game = game;
        this.mode = mode;

        if (this.mode === PLAYER_MODE.PLAYER){
            this.hand = new hand.Hand();
            this.score = 0;
        }

        else {
            this.hand = null;
        }
        this.inGame = true;

    }
}


module.exports.GamePlayer = GamePlayer;
module.exports.PLAYER_MODE = PLAYER_MODE;