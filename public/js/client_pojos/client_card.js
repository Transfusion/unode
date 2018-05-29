const CARD_COLORS = {
    RED: 1,
    BLUE: 2,
    GREEN: 3,
    YELLOW: 4,
};

const CARD_NUMBERS = {
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

const CARD_TYPES = {
    REGULAR: 1,
    REVERSE: 2,
    DRAW_2: 3,
    WILD: 4,
    DRAW_4: 5,
    SKIP: 6,
};

function getCardSpriteName(type, color=null, number=null){
    var name = "";
    if (type != CARD_TYPES.DRAW_4 && type != CARD_TYPES.WILD){
        switch(color){
            case CARD_COLORS.BLUE:
                name += "blue";
                break;
            case CARD_COLORS.RED:
                name += "red";
                break;
            case CARD_COLORS.YELLOW:
                name += 'yellow';
                break;
            case CARD_COLORS.GREEN:
                name += 'green';
                break;
        }
        name += '_';
    }

    if (type == CARD_TYPES.REGULAR){
        name += number;
        name += '_large';
    }
    if (type == CARD_TYPES.REVERSE){
        name += 'reverse_large';            
    }
    if (type == CARD_TYPES.SKIP){
        name += 'skip_large';
    }
    if (type == CARD_TYPES.DRAW_2){
        name += 'picker_large';
    }

    if (type == CARD_TYPES.DRAW_4){
        name += 'wild_pick_four_large';
    }
    if (type == CARD_TYPES.WILD){
        name += 'wild_colora_changer_large';
    }

    return name;

}


define('client_pojos/client_card', {
    CARD_COLORS: CARD_COLORS,
    CARD_NUMBERS: CARD_NUMBERS,
    CARD_TYPES: CARD_TYPES,
    getCardSpriteName: getCardSpriteName
})