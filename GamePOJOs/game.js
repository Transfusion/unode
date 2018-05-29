
// note that ruleset is already instantiated by the time it comes in...
// easier to have the ruleset produce its own deck
// assume there's no set of rules which allow joining in the middle of game yet

var player = require("./player");

class Game {

    constructor(id, ruleset, player){
        this.ruleset = ruleset;
        this.playerCount = ruleset.playerCount();
        this.deck = ruleset.getStartingDeck();

        // map of player ID, int, to player object
        this.players = {};

        initPlayers();
        
    }

    initPlayers(){
        for (var i = 0; i < this.playerCount; i++){
            this.players[i] = new player.GamePlayer(id, this);
        }
    }
    
}