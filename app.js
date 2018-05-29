var config = require('./config.js');
var express = require('express');
// var ws = require('ws').Server;

var bodyParser = require("body-parser");

var morgan = require('morgan');

var app = express();

var serv = require('http').Server(app);
// var io = require('socket.io')(serv);
// var wsserv = new ws({server: serv});
// require('./gamecomms/ws_events.js').bindWSEvents(wsserv);
var CommsManager = require('./gamecomms/CommsManager').CommsManagerInstance;
CommsManager.initWSTransport(serv);

var session = require('express-session')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// var FileStore = require('session-file-store')(session);

app.use(session({
    name: 'server-session-cookie-id',
    secret: 'my express secret',
    saveUninitialized: true,
    resave: true
    // store: new FileStore()
}));

// http://www.jyotman.xyz/post/logging-in-node.js-done-right
app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode < 400
    }, stream: process.stderr
}));

app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode >= 400
    }, stream: process.stdout
}));

// General logger
const logger = require('./logging.js').logger;
logger.info('Logging Initialized.');

var static_routes = require(__dirname+'/routes/static_items.js');

app.use('/', static_routes);

var single_page_route = require(__dirname+'/routes/single_page.js');
app.use('/', single_page_route);

var assets_route = require(__dirname + '/routes/assets.js');
app.use('/', assets_route);

var api_routes = require(__dirname + '/routes/api.js');
app.use('/api', api_routes);

var game_page_route = require(__dirname + '/routes/game_interface.js');
app.use('/game', game_page_route);

serv.listen(config.app.port, function(){
    console.log('UNode listening on ' + config.app.port);
});

/*io.on('connection', function(socket){
    console.log('a user connected');
    
});*/

// console.log(require.resolve('bootstrap'));
// module.exports.