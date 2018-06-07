var mongoose = require("mongoose");
var jsonSelect = require('mongoose-json-select');
var helpers = require("../utils/helpers");
var _ = require("underscore");
var userModel = require('../schemas/userSchema');

/**
 * Find User by Username
 *
 * @param {*} data
 * @param {*} callback
 */
var findOne = function(data, callback){
    return userModel.findOne(data, callback);
};

/**
 * Function create new user
 *
 * @param {*} data
 * @param {*} callback
 */
var create = function (data, callback){
    var user = new userModel(data);
    user.save(callback);
};

module.exports = {
    findOne,
    create,
};