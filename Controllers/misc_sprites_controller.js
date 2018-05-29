var config = require('../config');

var path = require('path')

function sendMiscSprite(req, res){
	var fileName = req.params['spriteFilename'];
	// console.log(fileName);
	res.sendFile( path.resolve(path.join(config.app.misc_sprites_dir, fileName)));
}


module.exports.sendMiscSprite = sendMiscSprite;