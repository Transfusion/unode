var express = require('express');
var router = express.Router();
var path = require('path');

var avatarsController = require('../Controllers/avatars_controller');
var cardSpritesController = require('../Controllers/card_sprites_controller');
var miscSpritesController = require('../Controllers/misc_sprites_controller');

router.get('/avatars', avatarsController.listAllAvatars);
router.get('/avatars/:avatarId', avatarsController.sendAvatar);


router.get('/card_sprites', cardSpritesController.listAllSpritePackages)
router.get('/card_sprites/:packageId', cardSpritesController.sendCardSprite)

router.get('/misc_sprites/:spriteFilename', miscSpritesController.sendMiscSprite);

module.exports = router;