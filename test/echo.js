var chai = require('chai');
var mocha = require('mocha');
var should = chai.should();
var io = require('socket.io-client');

describe("echo", function () {
    var socketURL = "http://localhost:9000";
    var options ={
            transports: ['websocket'],
            'force new connection': false
        };
    it("echos message", function (done) {
        var client = io(socketURL, options);
        client.on("connect", function () {
            console.log('connected to localhost:9000' );
            client.on("echo", function (message) {
                message.should.equal("Hello World");
                done();
            });
            client.emit('echo','Hello World');
            console.log('Client emit a event with message : Hello World');
        });
    });
});