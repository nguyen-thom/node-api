'use strict'
//create socket when connection

var redis = require('redis').createClient;
var adapter = require('socket.io-redis');
var colors = require("colors");
var socketIO = require('socket.io');
var memberEvent = require("./memberEvent");
var lib = require("../utils/index");
var config = lib.config;
var socketList = [];

var setupSocket = function (server) {
    var io = socketIO.listen(server);
    console.log("Socket listening...".blue);

    // Force Socket.io to ONLY use "websockets"; No Long Polling.
    io.set('transports', ['websocket']);

    // Using Redis
    var port = config.redis.port;
    var host = config.redis.host;
    var password = config.redis.password;
    var pubClient = redis(port, host, );
    var subClient = redis(port, host, { return_buffers: true, });
    io.adapter(adapter({ pubClient, subClient }));

    io.use((socket, next) => {
        require('../session')(socket.request, {}, next);
    });
    io.on('connection', function (socket) {
        socketList.push(socket.id);
        console.log('a user connected with id %s', socket.id);
        memberEvent(io, socket);
    });
    return io;
}
module.exports = setupSocket;