module.exports = function(db) {
    return {
        "NoteModel": require("./noteModel"),
        "UserModel": require("./userModel"),
    };
};