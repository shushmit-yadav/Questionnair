'use strict';

var BaseCtrl = require('../base/Controller');
var TagCtrl = require('./TagController');

module.exports = {

    addQuestion: (req, res) => {
        var requiredParamError = BaseCtrl.checkRequiredParams(req, ['name']);
        if(requiredParamError){
            return res.badRequest(requiredParamError);
        } else {
            var questionObj = {
                'name': req.param('name'),
                'description': req.param('description'),
                'tags': []
            },
            tagName = req.param('tag');
        
            async.waterfall([
                // get or add tag
                function(asyncWaterfallCb){
                    if(tagName){
                        TagCtrl.findOrCreateTag(tagName)
                        .then(tag => {
                            asyncWaterfallCb(null, tag);
                        })
                        .catch(err => {
                            asyncWaterfallCb(err);
                        });
                    } else {
                        asyncWaterfallCb(null, null);
                    }
                    
                },
                function(tag, asyncWaterfallCb){
                    if(tag){
                        questionObj['tags'].push(tag.id);
                    }

                    sails.models.question.create(questionObj)
                    .then(questionCreated => {
                        asyncWaterfallCb(null, questionCreated);
                    })
                    .catch(err => {
                        asyncWaterfallCb(err);
                    });
                }
            ], (asyncWaterfallError, asyncWaterfallResult) => {
                if(asyncWaterfallError){
                    var errCode = asyncWaterfallError && asyncWaterfallError.code ? asyncWaterfallError.code : 500,
                        errMessage = asyncWaterfallError && asyncWaterfallError.message ? asyncWaterfallError.message : asyncWaterfallError;
                    return res.status(errCode).send(errMessage);
                } else {
                    return res.ok(asyncWaterfallResult);
                }
            });
        }
    }

}
