var config = require('../config.js');
var logger = require('../logging').logger;
var path = require('path');
var fs = require('fs');

var card = require('../GamePOJOs/card');

function getAvailableSpritePackages(){
	var a = [];
	files = fs.readdirSync(config.app.card_sprites_dir);
	for (var i = 0; i < files.length; i++){
		a.push(files[i]);
	}
	return a;	
}

function listAllSpritePackages(req, res){
	res.send(getAvailableSpritePackages());
}

function _getCardSpritePath(packageId, type, color=null, number=null){
	var path = config.app.card_sprites_dir + '/' + packageId + '/';

	if (type != card.CARD_TYPES.DRAW_4 && type != card.CARD_TYPES.WILD){
		switch(color){
			case card.CARD_COLORS.BLUE:
				path += "blue";
				break;
			case card.CARD_COLORS.RED:
				path += "red";
				break;
			case card.CARD_COLORS.YELLOW:
				path += 'yellow';
				break;
			case card.CARD_COLORS.GREEN:
				path += 'green';
				break;
		}
		path += '_';
	}

	if (type == card.CARD_TYPES.REGULAR){
		path += number;
		path += '_large';
	}
	if (type == card.CARD_TYPES.REVERSE){
		path += 'reverse_large';			
	}
	if (type == card.CARD_TYPES.SKIP){
		path += 'skip_large';
	}
	if (type == card.CARD_TYPES.DRAW_2){
		path += 'picker_large';
	}

	if (type == card.CARD_TYPES.DRAW_4){
		path += 'wild_pick_four_large';
	}
	if (type == card.CARD_TYPES.WILD){
		path += 'wild_colora_changer_large';
	}

	path += '.png';
	return path;
}

// http://[domain:port]/card_sprites/default?type=1&color=1&number=0
// sends a red 0
function sendCardSprite(req, res, next){

	var packageId = req.params['packageId'];

	var type = 'type' in req.query ? req.query['type'] : null;

	if (type === 'back'){
		res.sendFile(path.resolve(config.app.card_sprites_dir + '/' + packageId + '/' + 'card_back_large.png'));
		return
	}
	else if (type === 'back_alt'){
		res.sendFile(path.resolve(config.app.card_sprites_dir + '/' + packageId + '/' + 'card_back_alt_large.png'));
		return
	}


	var color = 'color' in req.query ? req.query['color'] : null;
	var number = 'number' in req.query ? req.query['number'] : null;


	packages = getAvailableSpritePackages();
	if (packages.indexOf(packageId) == -1){
		res.sendStatus(404);
	}
	else {
		try {
			var cardSpritePath = _getCardSpritePath(packageId, parseInt(type), parseInt(color), parseInt(number));
			res.sendFile(path.resolve(cardSpritePath));
		}
		catch(err){
			logger.error(err);
			res.sendStatus(404);
		}
	}
}

module.exports.listAllSpritePackages = listAllSpritePackages;
module.exports.sendCardSprite = sendCardSprite;