'use strict';

var Mongoose 	= require('mongoose');

var CounterSchema = new Mongoose.Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

var counterModel = Mongoose.model('counter', CounterSchema);

module.exports = counterModel;