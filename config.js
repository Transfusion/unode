var config = {};
config.app = {};

config.app.port = 23456;
config.app.assets_dir = 'assets';
config.app.avatars_dir = config.app.assets_dir+'/avatars';
config.app.sprites_dir = config.app.assets_dir+'/sprites';
config.app.misc_sprites_dir = config.app.sprites_dir+'/misc';
config.app.card_sprites_dir = config.app.sprites_dir+'/cards';

config.game = {};
config.game.pendingTimeout = 600; // in seconds

config.app.jwt_shared_secret = "shared_secret";

module.exports = config;