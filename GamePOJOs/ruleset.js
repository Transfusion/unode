
var assert = require('assert');
// A ruleset should have configurable parameters that you can adjust, makes more sense
var cards = require('./card');

var utils = require('../utils');

/*class Parameter {
    constructor(name, defaultVal, validateFunc, infoString){
        // this.type = type;
        this.name = name;
        this.defaultVal = defaultVal;
        this.currentVal = defaultVal;

        // returns a boolean representing whether valid
        this.validateFunc = validateFunc;
        this.infoString = infoString;
    }

    // get infoString(){
    //     return this.infoString;
    // }

    validate(param){
        valid = this.validateFunc(param);
        if(valid){
            this.currentVal = param;
            return true;
        }
        return false;
    }
}*/

var PARAMETER_TYPE = {
    INT_PARAM: 1,
    FLOAT_PARAM: 2,
    STRING_PARAM: 3
}

class Parameter {

    constructor(){
        if (new.target === Parameter){
            throw new TypeError("Parameter is an abstract class.");
        }
    }

    static get type(){

    }

    get defaultValue(){
        throw new TypeError("Implement in the subclass.");
    }

    /*get value(){
        throw new TypeError("Implement in the subclass.");
    }

    set value(){
        throw new TypeError("Implement in the subclass.");
    }*/

    static get name(){
        throw new TypeError("Implement in the subclass.");
    }

    static get infoString(){
        throw new TypeError("Implement in the subclass.");
    }

    static validateFunc(){
        throw new TypeError("Implement in the subclass.");
    }
}

class IntegerParameter extends Parameter {
    constructor(){
        if (new.target === IntegerParameter){
            throw new TypeError("IntegerParameter is an abstract class.")
        }
        super();
    }

    static get type(){
        return PARAMETER_TYPE.INT_PARAM;
    }

    // Number.NEGATIVE_INFINITY    
    static get lwrBound(){
        throw new TypeError("IntegerParameter is an abstract class.")
    }

    // Number.INFINITY
    static get uprBound(){
        throw new TypeError("IntegerParameter is an abstract class.")
    }

}

class RuleSet {
    constructor(){
        if (new.target === RuleSet){
            throw new TypeError("RuleSet is an abstract class.");
        }
    }

    static get name(){
        throw new TypeError("Implement in the subclass.");
    }

    static get infoString(){
        throw new TypeError("Implement in the subclass.");
    }
    
    static get parameters(){
        throw new TypeError("Implement in the subclass.");
    }

    get playerCount(){
        throw new TypeError("Implement in the subclass.");
    }

    getStartDeck(){
        throw new TypeError("Implement in the subclass.");
    }

    // checks if the current card can be placed at the top of the pile
    isValidNextMove(Game, Card){
        throw new TypeError("Implement in the subclass.");
    }

}

class ClassicRoundsParam extends IntegerParameter {
    constructor(roundsCount){
        if (!ClassicRoundsParam.validateFunc(roundsCount)){
            throw new Error("Invalid Rounds Count");
        }
        else {
            super();
            this.value = roundsCount;
        }
    }

    static get lwrBound(){
        return 1;
    }

    static get uprBound(){
        return 10;
    }

    static get defaultValue(){
        return 3;
    }

    static get name(){
        return 'Number of Rounds';
    }
    static get infoString(){
        return 'Number of rounds must be between 1 and 10';
    }

    static validateFunc(roundsCount){
        return Number.isInteger(roundsCount) && roundsCount >= 2 && roundsCount <= 10;
    }
}


class ClassicPlayersParam extends IntegerParameter {
    constructor(playerCount){
        if (!ClassicPlayersParam.validateFunc(playerCount)){
            throw new Error("Invalid Player Count");
        }
        else {
            super();
            this.value = playerCount;
        }
    }

    static get lwrBound(){
        return 2;
    }

    static get uprBound(){
        return 10;
    }

    static get defaultValue(){
        return 2;
    }

    static get name(){
        return 'Max number of Players';
    }
    static get infoString(){
        return 'Max number of players must be between 2 and 10';
    }

    static validateFunc(playerCount){
        return Number.isInteger(playerCount) && playerCount >= 2 && playerCount <= 10;
    }
}

class ClassicRuleSet extends RuleSet {

    static get KEY_PLAYERS_PARAM(){
        return "players";
    }

    static get KEY_ROUNDS_PARAM(){
        return "rounds";
    }
    // static validatePlayersInt(playerCount){
    //     return Number.isInteger(playerCount) && playerCount >= 2 && playerCount <= 10;
    // }

    static get parameters(){
        var p = {};
        p[ClassicRuleSet.KEY_PLAYERS_PARAM] = ClassicPlayersParam;
        p[ClassicRuleSet.KEY_ROUNDS_PARAM] = ClassicRoundsParam;
        return p;
    }

    constructor(params){
        super();

        assert(utils.arraysEqual(Object.keys(params), Object.keys(ClassicRuleSet.parameters)));

        console.log(params);
        for (let [key, obj] of Object.entries(params)){
            params[key] = new ClassicRuleSet.parameters[key](obj);
        }

        this.params = params;
        // this.KEY_PLAYERS_PARAM = "players";
        // console.log(ClassicRuleSet.KEY_PLAYERS_PARAM);
        
        // this.parameters = {};
        // this.parameters[ClassicRuleSet.KEY_PLAYERS_PARAM] = new Parameter("Number Of Players", 
        //         4, ClassicRuleSet.validatePlayersInt, "Number of players must be between 2 and 10.");

    }

    static get name(){
        return "Classic"
    }
    
    static get infoString(){
        return "Default rules as you know them.";
    }

    get playerCount(){
        return this.params[ClassicRuleSet.KEY_PLAYERS_PARAM].value;
    }

    getStartDeck(){
        // add a deck (108 cards) every 4 players
        var decks = parseInt( (this.playerCount - 1) / 4) + 1;
        return new cards.RegularDeck(decks);
    }

    isValidNextMove(Game, Card){
        // return 
    }

}

var AvailableRuleSets = {
    "Classic" : ClassicRuleSet
};

module.exports.parameters = {};
module.exports.parameters.PARAMETER_TYPE = PARAMETER_TYPE;

module.exports.ClassicRuleSet = ClassicRuleSet;
module.exports.AvailableRuleSets = AvailableRuleSets;

module.exports.ClassicPlayersParam = ClassicPlayersParam;
module.exports.IntegerParameter = IntegerParameter;
module.exports.Parameter = Parameter;