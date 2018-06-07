 'use strict';

var noteModel = require('../schemas/noteSchema');
var helpers = require("../utils/helpers");
var Mongoose 	= require('mongoose');
var NM = noteModel;

NM.findOneAC = function(data,callback){
    return noteModel.findOne(data,callback);
}
NM.findInTitleAndContent = function(query, callback){
    	noteModel.find({'$or':[{title:new RegExp(query,'i')},{content:new RegExp(query,'i')}]}, function(err, collection){
    		if(err) { return callback(err); }
    		if(collection){
    			return callback(err, collection);
    		}
    	});
    }
NM.create = function (data, callback){
    var note = new noteModel(data);
    note.save(callback);
};

module.exports = NM;