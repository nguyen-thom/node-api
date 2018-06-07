var restify = require("restify");
var colors = require("colors");
var io = require('socket.io');
var lib = require("./utils");
var socket = require("./socket").socket;
//swagger = require("swagger-node-restify"),
var validator = require('restify-joi-middleware');
var passport = require('passport');
var ldap_config = require('./utils/ladapStrategy');
var config = lib.config;
var sessions = require("client-sessions");

var server = restify.createServer(lib.config.server)

//server.use(restify.queryParser())
//server.use(restify.bodyParser())

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({ mapParams: false }))
server.use(restify.plugins.gzipResponse());
server.use(validator());
server.use(sessions({
    // cookie name dictates the key name added to the request object
    cookieName: 'session',
    // should be a large unguessable string
    secret: 'ttv2018',
    // how long the session will stay valid in ms
    duration: 7 * 24 * 60 * 60 * 1000
}));
passport.use(ldap_config);
// Initialize passport
server.use(passport.initialize());
// Set up the passport session
server.use(passport.session());
// This is how a user gets serialized
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    lib.db.model('UserModel').findOne({ uid: id }, function (err, user) {
        if (!user) {
            done(new Error(`Cannot find user with uid=${id}`))
        } else {
            done(null, user);
        }
    })
})


restify.defaultResponseHeaders = function (data) {
    this.header('Access-Control-Allow-Origin', '*')
}

///Middleware to check for valid api key sent
server.use(function (req, res, next) {
    //We move forward if we're dealing with the swagger-ui or a valid 
    if (lib.helpers.validateKey('', req.headers.api_key, lib)) {
        next()
    } else {
        res.send(401, { error: true, msg: 'Invalid api key sent' })
    }
})

lib.helpers.setupRoutes(server, lib);
server.listen(config.server.port, function () {
    console.log("Server started successfully on url:" + server.url);
    lib.db.connect();
    socket(server);
});


