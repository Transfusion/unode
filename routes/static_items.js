var express = require('express');
var path = require('path');

var router = express.Router();

router.use('/css', express.static('public/css'));
router.use('/js', express.static('public/js'));

// https://stackoverflow.com/questions/30473993/how-to-use-npm-installed-bootstrap-in-express
router.use('/js', express.static( path.resolve(__dirname + '/../node_modules/bootstrap/dist/js'))); // redirect bootstrap JS
router.use('/js', express.static( path.resolve(__dirname + '/../node_modules/jquery/dist'))); // redirect JS jQuery
router.use('/js', express.static( path.resolve(__dirname + '/../node_modules/image-picker/image-picker')));
router.use('/js', express.static( path.resolve(__dirname + '/../node_modules/phaser-ce/build')));
router.use('/js', express.static( path.resolve(__dirname + '/../node_modules/requirejs')));
router.use('/js', express.static( path.resolve(__dirname + '/../node_modules/domReady')));

router.use('/css', express.static( path.resolve(__dirname + '/../node_modules/bootstrap/dist/css'))); // redirect 
router.use('/css', express.static( path.resolve(__dirname + '/../node_modules/image-picker/image-picker'))); // redirect 
module.exports = router;
