'use strict'

var passport = require('passport');

var BaseController = require("./basecontroller");
const USER_MODEL_NAME = "UserModel";

function login() {
    // Constructor
}

login.prototype = new BaseController();

module.exports = function (lib) {
    var controller = new login();
    controller.addAction({
        'path': '/check-login',
        'method': 'GET',
        'nickname': 'checkLogin',
    },
        function (req, res, next) {
            passport.authenticate('ldapauth', { session: false }, function (err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return next(controller.RESTError('InvalidCredentialsError', "Please check your details and try again."));
                } else {
                    req.login(user, function (err) {
                        if (err) {
                            return next(err);
                        }
                        console.log(req.isAuthenticated());
                        req.session.user_id = req.user.id;
                        var userModel = lib.db.model(USER_MODEL_NAME);
                        userModel.findOneAndUpdate({ uid: user.uid }, user, { upsert: true, new: true }).exec().then(user => {
                            return res.json({ success: true, message: 'authentication succeeded', user: Object.assign({ name: user.uid }, user) });
                        })
                    });
                }
            })(req, res, next);
        });
    return controller;
}


