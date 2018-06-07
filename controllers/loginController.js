var BaseController = require("./basecontroller");
var ldap = require('ldapjs');
var ldapServerStr = 'ldap://10.190.201.151:389';
var dn = 'cn={},ou=Users,dc=dartslive,dc=com';
var session;

function login() {
    // Constructor
}

login.prototype = new BaseController();

module.exports = function(lib) {
    var controller = new login();

    controller.addAction({
        'path': '/check-login',
        'method': 'GET',
        'nickname': 'checkLogin',
    },
    function(req, res, next) {
        validForm(req);
        checkAuth(req, res, next);
    });

    /**
     * Contains all handle validation for login form
     *
     * @param {} req
    */
    function validForm(req) {
        // TODO: Start do validate form;
    }

    /**
     * Check authenticate user <br>
     * If user logged in then search user information from database and response json <br>
     * Else implement check authenticate with LDAP server
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
    */
    function checkAuth(req, res, next) {
        session = req.session;
        if (!session.user_name) {
            checkAuthWithLdap(req, res, next);
        } else {
            var username = session.user_name;
            setSessionAndResponse(res, session, username);
        }
    }

    /**
     * Implements check authenticate with LDAP server
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
    */
    function checkAuthWithLdap(req, res, next) {
        var client = ldap.createClient({
            url: ldapServerStr
        });

        var username = req.query.username;
        var password = req.query.password;
        var dnserver = dn.format(username);
        client.bind(dnserver, password, function (err) {
            if (err) {
                createResponseLoginFail(res);
            } else {
                setSessionAndResponse(res, session, username);
            }
        });
    }

    /**
     * Set user information into session <br>
     * Create response JSON Login success and return to client
     *
     * @param {*} res
     * @param {*} session
     * @param {*} username
    */
    function setSessionAndResponse(res, session, username) {
        lib.db.model('UserModel').findOne({username : username},function(err, user) {
            if(err) {
                createResponseLoginFail(res);
            }
            if(!user) {
                insertAndCreateRespone(res, username);
            } else {
                session.username = username;
                createResponseSuccess(res, user);
            }
        });
    }

    /**
     * Insert new user information into database <br>
     * Create format JSON response to client
     *
     * @param {*} res
     * @param {*} username
     */
    function insertAndCreateRespone(res, username) {
        var data = {'username' : username};
        lib.db.model('User').create(data, function(err, user) {
            if(err) {
                createResponseLoginFail(res);
            }
            session.username = username;
            createResponseSuccess(res, user);
        });
    }

    /**
     * Create format JSON response login success
     *
     * @param {*} res
     * @param {*} data
     */
    function createResponseSuccess(res, data) {
        var obj = {
            "RESULT" : "NO_ERROR",
            "DATA" : data,
        };
        controller.writeHAL(res, obj);
    }

    /**
     * Create format JSON response login fail
     */
    function createResponseLoginFail(res) {
        var obj = {
            "RESULT" : "LOGIN_FAIL",
            "DATA" : {},
        };
        controller.writeHAL(res, obj);
    }

    return controller;
};