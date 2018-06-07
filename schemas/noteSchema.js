'use strict';

var Mongoose 	= require('mongoose');
var _ = require('underscore');
var counterModel = require('./counterSchema');
var helpers = require("../utils/helpers");
var fields =new Map([
            ['nid', { type: Number, required: false, unique: true}],
            ['title', { type: String, required: true }],
            ['content',  { type: String, default: null }],
            ['color', { type: String, default: 'blue', enum: ['blue','red','green','yellow','gray']}],
            ['create_at', { type: Date, require: false, default: null}],
            ['update_at',{ type: Date, required: false, default: null}],
        ]);
var createSchema = function(noteMap){
    var newSchema = {};
    noteMap.forEach(function(value,key){
        newSchema[key] = value;
    });
    return newSchema;
}
var NoteModel = new Mongoose.Schema(createSchema(fields));

NoteModel.pre('save', function(next) {
    var note = this;
    if(note.isNew){
        counterModel.findByIdAndUpdate({_id: 'nid'}, {$inc: { seq: 1} },{new: true, upsert: true})
            .then(function(counter){
                note.nid = counter.seq;
                note.create_at = new Date();
                next();
            })
            .catch(function(error){
                console.log("Error:" + error);
            })
    }else{
        note.update_at = new Date();
        next();
    }

});
NoteModel.methods.toHAL = function(f) {
    var note = this;
    var halObj
    var obj  = {};
    if(f){
        var arr_fields = f.split(',');
        _.each(arr_fields, function(field){
            if(fields.has(field)){
                obj[field] = note[field];
            }
        });
        halObj = helpers.makeHAL(obj);
    }else{
        fields.forEach(function(value,key){
            obj[key] = note[key];
        });
        halObj = helpers.makeHAL(obj);
    }
    return halObj;
}
var noteModel = Mongoose.model('note', NoteModel);

module.exports = noteModel;
