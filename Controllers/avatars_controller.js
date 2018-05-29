var config = require('../config.js');
var path = require('path');
var fs = require('fs');

function listAllAvatars(req, res){
	a = {};
	files = fs.readdirSync(config.app.avatars_dir);
	for (var i = 1; i <= files.length; i++){
		a[i] = "avatar-"+String(i);
	}
	// console.log(files);
	res.send(a);
}

function sendAvatar(req, res){
	// console.log(req.params);
	res.sendFile(path.resolve(config.app.avatars_dir, "avatar-" + req.params['avatarId'] + '.svg' ));
}

module.exports.listAllAvatars = listAllAvatars;
module.exports.sendAvatar = sendAvatar;