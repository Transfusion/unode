var assert = require('assert');
var utils = require("../utils.js");

var CARD_COLORS = {
    RED: 1,
    BLUE: 2,
    GREEN: 3,
    YELLOW: 4,
};

var CARD_NUMBERS = {
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    NINE: 9,
};

var CARD_TYPES = {
    REGULAR: 1,
    REVERSE: 2,
    DRAW_2: 3,
    WILD: 4,
    DRAW_4: 5,
    SKIP: 6,
};

class Card {

    constructor(type, color=null, number=null){
        this.type = type;
        this.color = color;
        this.number = number;
        if (this.type == CARD_TYPES.WILD || this.type == CARD_TYPES.DRAW_4) {
            this.color = null;
            this.number = null;
        }

        if (this.type == CARD_TYPES.DRAW_2 || this.type == CARD_TYPES.REVERSE || this.type == CARD_TYPES.SKIP) {
            this.number = null;
        }
    }

    toJSON(){
        return {
            type: this.type,
            color: this.color,
            number: this.number
        };
    }

}

class Deck {
    constructor(){
        if (new.target === Deck){
            throw new TypeError("Deck is an abstract class.");
        }
    }

    shuffle(){
        throw new TypeError("Deck is an abstract class.");
    }

    getTopCard(){
        throw new TypeError("Deck is an abstract class.")
    }

    getCards(){
        throw new TypeError("Deck is an abstract class.")
    }
}

class RegularDeck {
    constructor(decks=1){
        this.cards = [];
        if(!(Number.isInteger(decks))) {
            throw new TypeError("decks must be an int");
        }
        if (decks < 1){
            throw new RangeError("decks must be greater than 0");
        }
        this.decks = decks;
        this.initCards();
    }

    initCards(){
        for (var i = 0; i < this.decks; i++){
            this.cards = this.cards.concat(this.getOneDeck());
        }
    }

    getOneDeck(){
        var arr = [];
        for (let [key, value] of Object.entries(CARD_NUMBERS)){
            // add all the numbered cards
            if (value != CARD_NUMBERS.ZERO){
                for (let [key2, value2] of Object.entries(CARD_COLORS)){
                    arr.push(new Card(CARD_TYPES.REGULAR, value2, value));    
                }
                for (let [key2, value2] of Object.entries(CARD_COLORS)){
                    arr.push(new Card(CARD_TYPES.REGULAR, value2, value));    
                }
            }
            else {
                for (let [key2, value2] of Object.entries(CARD_COLORS)){
                    arr.push(new Card(CARD_TYPES.REGULAR, value2, value));    
                }
            }
        }
        // add the 8 skip, 8 reverse, 8 draw2
        for (let [key, value] of Object.entries(CARD_COLORS)){
            for (let t of [CARD_TYPES.SKIP, CARD_TYPES.REVERSE, CARD_TYPES.DRAW_2]){
                arr.push(new Card(t, value));
                arr.push(new Card(t, value));
            }
        } 
        // add the 4 wild and 4 draw4
        for (var i = 0; i < 4; i++){
            arr.push(new Card(CARD_TYPES.WILD));
            arr.push(new Card(CARD_TYPES.DRAW_4));
        }

        assert(arr.length == 108);
        return arr;
    }

    shuffle(){
        utils.shuffle(this.cards);
    }

    getTopCard(){
        return this.cards.shift();
    }

    getCards(){
        return this.cards;
    }
}

class Pile {
    constructor(){
        if (new.target === Pile){
            throw new TypeError("Pile is an abstact class.");
        }
    }

    topCard(){
        throw new TypeError("Pile is an abstact class.");
    }

    placeCard(card){
        throw new TypeError("Pile is an abstact class.");
    }
}

class RegularPile extends Pile {
    constructor(){
        super();
        this.cards = [];
    }

    topCard(){
        return this.cards[0];
    }

    placeCard(card){
        this.cards.push(card);
    }
}

module.exports.Card = Card;
module.exports.CARD_NUMBERS = CARD_NUMBERS;
module.exports.CARD_TYPES = CARD_TYPES;
module.exports.CARD_COLORS = CARD_COLORS;
module.exports.RegularDeck = RegularDeck;
module.exports.RegularPile = RegularPile;

