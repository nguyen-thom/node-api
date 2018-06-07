var Mongoose = require('mongoose');
var helpers = require("../utils/helpers");

var UserModel = new Mongoose.Schema({
    nid: { type: Number, required: false, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    employeeCd: { type: String, default: null },
    DOB: { type: String, default: null },
});

UserModel.methods.toHAL = function () {
    var halObj = helpers.makeHAL(this.toJSON());
    return halObj;
};
UserModel.pre('save', function (next) {
    var user = this;
    if (user.isNew) {
        counterModel.findByIdAndUpdate({ _id: 'uid' }, { $inc: { seq: 1 } }, { new: true, upsert: true })
            .then(function (counter) {
                user.uid = counter.seq;
                //user.create_at = new Date();
                next();
            })
            .catch(function (error) {
                console.log("Error:" + error);
            })
    } else {
        //user.update_at = new Date();
        next();
    }

});

var userModel = Mongoose.model('User', UserModel, 'User');
module.exports = userModel;