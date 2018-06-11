class playerInfoManager {

    constructor(game, playerInfoList){
        this.game = game;
        // this.playerInfo = playerInfo;
        this.playerInfo = {};

        for (let player of playerInfoList){
            this.playerInfo[player.id] = new playerInfoManager.playerInfoSpriteContainer(this.game, player);
        }

        // this._initPlayerInfoWidget();
    }

    render(){
        var numPlayers = Object.keys(this.playerInfo).length;
        // calculate spacing

        var height = 20 + 50 + 20;
        for (let [key, obj] of Object.entries(this.playerInfo)){
            obj.mainSprite.x = this.game.world.width - 130;
            obj.mainSprite.y = height;

            height += obj.mainSprite.height - 40;
        }

    }

    /*_initPlayerInfoWidget(player){
        var ctnr = new playerInfoManager.playerInfoSpriteContainer(player);
    }*/


}

playerInfoManager.playerInfoSpriteContainer = class {

    // manipulate the mainSprite object
    constructor(game, playerInfo){
        this.game = game;
        this.playerInfo = playerInfo;

        var style = { font: "15px Arial", fill: "#ffffff" };

        this.mainSprite = this.game.add.sprite(0,0, "transparent_100x100");

        // already loaded in the loadAssetsState
        this.avatarSprite = this.game.add.sprite(0, 0, "avatar-" + this.playerInfo.avatar);

        // want to have a fixed height so that we can calculate the positioning
        this.avatarSprite.height = 30;
        this.avatarSprite.scale.x = this.avatarSprite.scale.y;

        this.scoreText = this.game.add.text(0, 0,  "Score: " + this.playerInfo.score, { font: "10px Arial", fill: "#ffffff" });

        this.remainingCardsText = this.game.add.text(0, 0, "Cards: " + this.playerInfo.remainingCards, { font: "10px Arial", fill: "#ffffff" });

        this.usernameText = this.game.add.text(0, 0, playerInfo.name +'#'+playerInfo.tripcode, { font: "15px Arial", fill: "#ffffff"});

        this.mainSprite.addChild(this.avatarSprite);
        this.mainSprite.addChild(this.scoreText);

        // this.avatarSprite.addChild(this.scoreText);
        this.mainSprite.addChild(this.remainingCardsText);

        this.mainSprite.addChild(this.usernameText);
        this._relativelyPositionChildren();
    }

    _relativelyPositionChildren(){
        // this.scoreText.anchor.setTo(0.5);
        this.scoreText.scale.x = 1;
        this.scoreText.scale.y = 1;

        this.scoreText.x = this.avatarSprite.width + 10;
        this.scoreText.y = 0;

        this.remainingCardsText.x = this.avatarSprite.width + 10;
        this.remainingCardsText.y = this.scoreText.height - 4;

        this.usernameText.y = this.avatarSprite.height + 5;

        /*this.mainSprite.x = 100;
        this.mainSprite.y = 100;*/
        // this.remainingCardsText.anchor.setTo(0.5);
        // this.usernameText.anchor.setTo(0.5);

        // position it below the profile pic.
        // this.usernameText.y = 150;
    }

    /*{
        id: 'test1',
        avatar: 4,
        name: 'tester',
        tripcode: 'tester',
        gamePlayerId: 0,
        remainingCards: 100,
        score: 5450
    }*/

    update(playerInfo){
        this.scoreText.setText("Score: " + playerInfo.score);
        this.remainingCardsText.setText("Cards: " + playerInfo.remainingCards);

        // this.remainingCardsText.setText(playerInfo.remainingCards);
        // the username shouldn't change in the middle of the game!
    }

    destroy(){
        this.avatarSprite.destroy();
    }
}

var mockupState = function(game){}
mockupState.prototype = {

    
    _renderCard(card_pojo, posX, posY, width){
        var card_sprite_key = this.game.data.client_card.getCardSpriteName(card_pojo.type, card_pojo.color, card_pojo.number);
        var card = game.add.sprite(posX, posY, card_sprite_key);
        card.width = width;
        card.scale.y = card.scale.x;
        // console.log(card.scale);
        return card;
    },

    _renderMouseOverCard: function(card){
        if (definedAndNotNull(this.mouseOverCard)){
            this.mouseOverCard.destroy();
        }
        this.mouseOverCard = this._renderCard(card, this.game.width-70, this.game.height-100, 80);
        this.mouseOverCard.anchor.setTo(0.5);
    },

    _renderOwnHand: function(hand){
        // calculate the positioning at the bottom
        // var card = hand[0];
        // console.log(card);

        if (definedAndNotNull(this.handCardSpriteArray)){
            // destroy the entire hand
            for (let cardSprite of this.handCardSpriteArray){
                cardSprite.destroy();
            }
        }

        this.handCardSpriteArray = []
        var x = 10;
        var y = this.game.height - 100;
        var spacingBetweenCards = (this.game.width - 200) / (hand.length);


        var state_this = this;
        for (let card of hand){
            function _cardInputOverListener(){
                // console.log(card);
                state_this._renderMouseOverCard(card);
            }

            function _cardInputDownListener(){
                console.log(card);
                console.log('clicked on card!!');
            }

            var cardSprite = this._renderCard(card, x, y, 50);
            cardSprite.inputEnabled = true;
            cardSprite.events.onInputOver.add(_cardInputOverListener, this);
            cardSprite.events.onInputDown.add(_cardInputDownListener, this);
            this.handCardSpriteArray.push(cardSprite);
            
            x += spacingBetweenCards;
        }
        

    },

    _renderLastCard: function(card){
        if (definedAndNotNull(this.currentCardSprite)){
            this.currentCardSprite.destroy();
        }
        this.currentCardSprite = this._renderCard(card, this.world.centerX-60, this.world.centerY, 100);
        this.currentCardSprite.anchor.setTo(0.5);

    },

    _renderGameState: function(game_state_msg){
        this._renderOwnHand(game_state_msg.myHand.cards);

        this._renderLastCard(game_state_msg.lastPlayedCard);
        this.game.playerInfoManager = new playerInfoManager(this.game, game_state_msg.playersInfo);
        this.game.playerInfoManager.render();

        this._renderRoundText(game_state_msg.round);
        this._renderStatusText('hello hello how are you');
        this._renderStatusText("It is player 02's turn");
        // this._renderRemainingTime(game_state_msg.);
    },

    _renderFullScreenToggle: function(){
        var state_this = this;
        function _fullScreenListener(){
            if (game.scale.isFullScreen){
                state_this.game.scale.stopFullScreen();
            }
            else {
                state_this.game.scale.startFullScreen(false);
            }
        }

        this.fullScreenToggleBtn = this.game.add.button(this.game.width-70, 20, 'fullscreen_toggle');
        this.fullScreenToggleBtn.width = 50;
        this.fullScreenToggleBtn.scale.y = this.fullScreenToggleBtn.scale.x;
        this.fullScreenToggleBtn.events.onInputDown.add(_fullScreenListener, this);
    },

    _renderDrawDeck: function(){
        /*var style = { font: "60px Arial", fill: "#ffffff" };  
        this.label_score = this.game.add.text(20, 20, "kampret", style);*/
        // this.hello_sprite.addChild(this.label_score);

        this.drawDeckBtn = game.add.sprite(this.world.centerX+50, this.world.centerY, 'card_back_alt_large');
        this.drawDeckBtn.anchor.setTo(0.5);
        this.drawDeckBtn.width = 100;
        this.drawDeckBtn.scale.y = this.drawDeckBtn.scale.x;

        /*drawDeckBtn.addChild(this.label_score);
        this.label_score.x = 100;*/
    },

    _renderUnoBtn: function(){
        this.unoBtn = this.game.add.button(50, this.world.centerY+50, 'call_uno_btn');
        this.unoBtn.width = 100;
        this.unoBtn.scale.y = this.unoBtn.scale.x;
    },

    _renderCallOutBtn: function(){
        this.calloutBtn = this.game.add.button(50, this.world.centerY+120, 'call_out_btn');
        this.calloutBtn.width = 100;
        this.calloutBtn.scale.y = this.calloutBtn.scale.x;
    },

    _renderRoundText: function(round){
        if (!(definedAndNotNull(this.roundText))){
            var style = { font: "15px Arial", fill: "#ffffff" };
            this.roundText = this.game.add.text(10, 10, "Round: " + round, style);
        }
        else {
            this.roundsText.setText("Round: " + round);
        }
    },

    /*_renderRemainingTime: function(remainingSeconds){
        if (!definedAndNotNull(this.remainingTimeText)){
            var style = { font: "15px Arial", fill: "#ffffff" };
            this.remainingTimeText = this.game.add.text(10, 20, "Time Left: "+ remainingSeconds, style);
        }
        else {
            this.remainingTimeText.setText("Time Left: "+ remainingSeconds);
        }
    },*/

    _renderStatusText: function(statusText){
        if (!(definedAndNotNull(this.statusText))){
            var style = { font: "15px Arial", fill: "#D32F2F"};
            this.statusText = this.game.add.text(this.world.centerX, 0, statusText, style);
            this.statusText.anchor.setTo(0.5, 0);
        }
        else {
            this.statusText.setText(statusText);
        }
    },

    preload: function(){

    },

    init: function(){
        var game_state = {
            currentTurnPlayer: 0,
            lastPlayedCard: {
                color: 2,
                number: 6,
                type: 1
            },

            myHand: {
                isUno: false,
                isEmpty: false,
                cards: [
                    {
                        color: 4,
                        number: 3,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 4,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 2,
                        number: 2,
                        type: 4
                    },
                    {
                        color: 1,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    },
                    {
                        color: 3,
                        number: 2,
                        type: 1
                    }
                ]               
            },

            playersInfo: [
                {
                    id: 'test1',
                    avatar: 4,
                    name: 'tester',
                    tripcode: 'tester',
                    gamePlayerId: 0,
                    remainingCards: 100,
                    score: 5450
                },
                {
                    id: 'test2',
                    avatar: 3,
                    name: 'tester2',
                    tripcode: 'tester2',
                    gamePlayerId: 1,
                    remainingCards: 11,
                    score: 8
                }
            ],

            round: 1,
            score: 0

        }

        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        
        this._renderFullScreenToggle();
        this._renderDrawDeck();
        this._renderUnoBtn();
        this._renderCallOutBtn();

        this._renderGameState(game_state);
    },

    create: function(){

    }
}

define('game_states/mockupState', function(){
    return mockupState;
});