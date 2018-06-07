var halson = require("halson");
var _ = require("underscore");

module.exports = {
    makeHAL: makeHAL,
    setupRoutes: setupRoutes,
    validateKey: validateKey
}

function setupRoutes(server, lib) {
    for (var controller in lib.controllers) {
        var cont = lib.controllers[controller](lib)
        cont.setUpActions(server)
    }
}


/**
Makes sure to sign every request and compare it 
against the key sent by the client, this way
we make sure its authentic

*/
function validateKey(hmacdata, key, lib) {
    //This is for testing the swagger-ui, should be removed after development to avoid possible security problem :)
    if (+key == 'test') return true
    var hmac = require("crypto").createHmac("md5", lib.config.secretKey)
        .update(hmacdata)
        .digest("hex");
    //console.log('mac:' + hmac)
    return hmac == key
}

function makeHAL(data, links, embed) {
    var obj = halson(data);

    if (links && links.length > 0) {
        _.each(links, function (lnk) {
            obj.addLink(lnk.name, {
                href: lnk.href,
                title: lnk.title || ''
            })
        })
    }

    if (embed && embed.length > 0) {
        _.each(embed, function (item) {
            obj.addEmbed(item.name, item.data)
        })
    }

    return obj
}
