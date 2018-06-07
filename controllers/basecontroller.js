var _ = require("underscore");
var restify = require("restify");
var colors = require("colors");
var halson = require("halson");
var errors = require('restify-errors');
var lib = require("../utils/index");
var validator = require('restify-joi-middleware');

function BaseController() {
    this.actions = [];
    this.validations = [];
    this.server = null
}

BaseController.prototype.setUpActions = function (app) {
    this.server = app
    _.each(this.actions, function (act) {
        var method = act['spec']['method']
        console.log("Setting up auto-doc for (", method, ") - ", act['spec']['nickname'])
        if (!act['validation']) {
            app[method.toLowerCase()](act['spec']['path'], act['action']);
        } else {
            app[method.toLowerCase()]({ path: act['spec']['path'], validation: act['validation'] }, act['action']);
        }
    })
}


BaseController.prototype.addAction = function (spec, fn, opts) {
    var newAction;
    if (!opts) { //undefined
        newAction = {
            'spec': spec,
            action: fn
        }
    } else {
        newAction = {
            'spec': spec,
            'validation': opts['validation'] || undefined,
            action: fn
        }
    }
    this.actions.push(newAction);
}

BaseController.prototype.RESTError = function (type, msg) {
    var typeError = type;
    if (!errors[typeError]) {
        console.log("Type " + typeError + " of error not found".red);
        typeError = 'InternalServerError';
    }
    return new errors[typeError](msg.toString())
}

/**
Takes care of calling the "toHAL" method on every resource before writing it 
back to the client
*/
BaseController.prototype.writeHAL = function (res, obj, fields, option) {
    if (Array.isArray(obj)) {
        var newArr = [];
        _.each(obj, function (item, k) {
            item = item.toHAL(fields);
            newArr.push(item);
        })
        // obj = halson(newArr);
        lib.helpers.makeHAL(newArr);
    } else {
        if (obj && obj.toHAL) {
            obj = obj.toHAL(fields);
        }
    }
    if (!obj) {
        obj = {};
    }
    if (!option) {
        res.json(obj);
    } else {
        res.json({
            meta: halson(option.meta),
            data: obj
        });
    }
}

/**
Returns a HAL object, using the attributes passed.
@data Is the JSON data
@links(optional) An array of links objects ({name, href, title(optional)})
@embed(optional) A list of embedded JSON objects with the form: ({name, data})
BaseController.prototype.toHAL = function(data, links, embed) {
	var obj = halson(data)

	if(links && links.length > 0) {
		_.each(links, function(lnk) {
			obj.addLink(lnk.name, {
				href: lnk.href,
				title: lnk.title || ''
			})
		})
	}

	if(embed && embed.length > 0) {
		_.each(embed, function (item) {
			obj.addEmbed(item.name, item.data)
		})
	}

	return obj
}


*/
module.exports = BaseController;