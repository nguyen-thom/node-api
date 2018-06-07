var BaseController = require("./basecontroller");
var _ = require("underscore");
var validation = require('../validation/noteReqValidation');
const NOTE_MODEL_NAME = 'NoteModel';
const DEFAULT_PER_PAGE = 20;

function Note() {};

Note.prototype = new BaseController();

var handleGetListNote = 

module.exports = function(lib) {
    var controller = new Note();
  
    controller.addAction({
        'path': '/notes',
        'method': 'GET',
        'nickname': 'getListNotes'
    }, handleGetListNotes(lib, controller));
  
    controller.addAction({
        'path': '/note/:id',
        'method': 'GET',
        'nickname': 'getNote'
    }, handleGetNote(lib, controller),{'validation':validation.getTask});

    controller.addAction({
        'path': '/note',
        'method': 'POST',
        'nickname': 'newNote'
    }, handleAddNote(lib, controller));

    controller.addAction({
        'path': '/note/:id',
        'method': 'PUT',
        'nickname': 'updateNote'
    }, handleUpdateNote(lib, controller));
    return controller;
  }

function handleGetListNotes(lib, controller) {
    var perPage = 20;
    return function (req, res, next) {
        var page = req.query.page || 1;
        perPage = req.query.per_page;
        var fields = req.query.fields || null;
        var criteria = {};
        if (req.params.state) {
            criteria.state = new RegExp(req.params.state, 'i');
        }
        var nm = lib.db.model(NOTE_MODEL_NAME);
        nm.find(criteria)
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function (err, list){
            if (err){
                return next(controller.RESTError('InternalServerError', err));
            }else{
                controller.writeHAL(res, list, fields);
            }
        });
    };
}

function handleGetNote(lib, controller) {
    return function (req, res, next) {
        var id = req.params.id;
        var fields = req.query.fields;
        if (id) {
            var nm = lib.db.model(NOTE_MODEL_NAME);
            nm.findOne({ nid: id }, function (err, data) {
                if (err)
                    return next(controller.RESTError('InternalServerError', err));
                if (!data)
                    return next(controller.RESTError('ResourceNotFoundError', 'Note not found'));
                controller.writeHAL(res, data,fields);
            });
        }
        else {
            next(controller.RESTError('InvalidArgumentError', 'Invalid id'));
        }
    };
}

function handleAddNote(lib, controller) {
    return function (req, res, next) {
        var data = req.body;
        if (data) {
            var noteModel = lib.db.model(NOTE_MODEL_NAME);
            noteModel.create(data, function (err, store) {
                if (err)
                    return next(controller.RESTError('InternalServerError', err));
                controller.writeHAL(res, store);
            });
        }
        else {
            next(controller.RESTError('InvalidArgumentError', 'No data received'));
        }
    };
}

function handleUpdateNote(lib, controller) {
    return function (req, res, next) {
        var data = req.body;
        var id = req.params.id;
        if (id) {
            var noteModel = lib.db.model(NOTE_MODEL_NAME);
            noteModel.findOne({ nid: id }).exec(function (err, note) {
                if (err)
                    return next(controller.RESTError('InternalServerError', err));
                if (!note)
                    return next(controller.RESTError('ResourceNotFoundError', 'Note not found'));
                note = _.extend(note, data);
                noteModel.update(note, function (err, d) {
                    if (err)
                        return next(controller.RESTError('InternalServerError', err));
                    controller.writeHAL(res, d);
                });
            });
        }
        else {
            next(controller.RESTError('InvalidArgumentError', 'Invalid id received'));
        }
    };
}
