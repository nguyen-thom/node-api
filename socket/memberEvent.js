'use strict'
var lib = require("../utils/index");
//use define event relative with member
//add member
//block member
//accept member
var memberEvent = function(io,socket){
    //use for test (echo.js)//please detele
    socket.on('echo', function (msg, callback) {
        callback = callback || function () {};
        io.emit("echo", msg);
        console.log('broadcasting my-message', msg);
        callback(null, "Done.");
    });
    socket.on('new-member-request',function(member){
        //check member name in list member
        lib.db.model('userModel').find(member.mid,function(err,data){
            //todo something
        });
        //add member to list friends of current member
        
    });
    socket.on('member-online',function(member){
        //check member name in list member
        //add member to list friends of current member
        
    });
    socket.on('member-change-status',function(member,status){
        //check member name in list member
        //add member to list friends of current member
        
    });
    socket.on('member-logout',function(member,status){
        //check member name in list member
        //add member to list friends of current member
        
    });
    socket.on('member-logout',function(member,status){
        //check member name in list member
        //add member to list friends of current member
        
    });
    socket.on('member-accept',function(member){

    });
   
    
}
module.exports = memberEvent;
