'use strict';

var BaseCtrl = require('../base/Controller'),
    TagCtrl = require('./TagController'),
    AnswerCtrl = require('./AnswerController');

module.exports = {


    questionsByTag: (req, res) => {
        var requiredParamError = BaseCtrl.checkRequiredParams(req, ['tag']);
        if(requiredParamError){
            return res.badRequest(requiredParamError);
        } else {
            var tagName = req.param('tag'); 
            TagCtrl.getTagByTagName(tagName)
            .then(tag => {
                return tag;
            })
            .then(tag => {
                var tagId = tag ? tag.id : undefined;
                return sails.models.question.find({
                    where: {
                        'tags': {
                            'contains': tagId
                        }
                    },
                    sort: [{ totalVotes: 'DESC'}, { createdAt: 'DESC'}],
                    limit: 10
                })
                .then(questions => {
                    return questions;
                })
                .catch(err => {
                    throw err;
                });
            })
            .then(questions => {
                return res.ok(questions);
            })
            .catch(err => {
                var errCode = err && err.code ? err.code : 500,
                    errMessage = err && err.message ? err.message : err;
                return res.status(errCode).send(errMessage); 
            });
        }
    },

    getQuestion: (req, res) => {
        var requiredParamError = BaseCtrl.checkRequiredParams(req, ['id']);
        if(requiredParamError){
            return res.badRequest(requiredParamError);
        } else {
            var questionId = req.param('id');
            sails.models.question.findOne({'id': questionId})
            .then(question => {
                if(!question){
                    var err = new Error();
                    err.code = 404;
                    err.message = "No question found with id - " + questionId;
                    throw err;
                } else {
                    // get all answers
                    AnswerCtrl.getAnswersByQuestionId(questionId)
                    .then(answers => {
                        question.answers = answers;

                        return question;
                    })
                    .catch(err => {
                        throw err;
                    });
                }
            })
            .then(question => {
                return res.ok(question);
            })
            .catch(err => {
                var errCode = err && err.code ? err.code : 500,
                    errMessage = err && err.message ? err.message : err;
                return res.status(errCode).send(errMessage);
            });
        }
    },


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
    },

    updateQuestion: (req, res) => {
        var requiredParamError = BaseCtrl.checkRequiredParams(req, ['questionId']);
        if(requiredParamError){
            return res.badRequest(requiredParamError);
        } else {
            var questionObj = {
                'name': req.param('name'),
                'description': req.param('description'),
            };

            sails.models.question.update({'id': req.param('questionId')}, questionObj)
            .then(questionUpdated => {
                return res.ok('Question has been updated successfully');
            })
            .catch(err => {
                // asyncWaterfallCb(err);
                var errCode = err && err.code ? err.code : 500,
                    errMessage = err && err.message ? err.message : err;
                return res.ok(errCode).send(errMessage);
            });
        }
    },


    addOrRemoveTag: (req, res) => {
        var requiredParamError = BaseCtrl.checkRequiredParams(req, ['id', 'tag']);
        if(requiredParamError){
            return res.badRequest(requiredParamError);
        } else {
            var tagName = req.param('tag');
            TagCtrl.findOrCreateTag(tagName)
            .then(tag => {
                module.exports.addOrRemoveTagFromQuestion(req.param('id'), tag.id)
                .then(tagAddedOrRemoved => {
                    return tagAddedOrRemoved;
                })
                .catch(err => {
                    throw err;
                });
            })
            then(tagAddedOrRemoved => {
                return res.ok('Question has been updated successfully with tag - '+ tagName);
            })
            .catch(err => {
                var errCode = err && err.code ? err.code : 500,
                    errMessage = err && err.message ? err.message : err;
                return res.status(errCode).send(errMessage);
            });
        }
    },



    addOrRemoveTagFromQuestion: (questionId, tagId) => {
        return new Promise((fulfill, reject) => {
            sails.models.question.findOne({'id': questionId})
            .then(question => {
                if(question){
                    var tags = question.tags ? question.tags : [];
                    var tagIndex = tags.findIndex(item => item == tagId);
                    if(tagIndex == -1){
                        tags.push(tagId);
                    } else {
                        tags.splice(tagIndex, 1);
                    }

                    return sails.models.question.update({'id': question.id}, {'tags': tags})
                    .then(tagsUpdated => {
                        return tagsUpdated;
                    })
                    .catch(err => {
                        throw err;
                    });
                } else {
                    var err = new Error();
                    err.code = 403;
                    err.message = "Not question found with questionId - " + questionId;
                    throw err;
                }
            })
            .then(tagsUpdated => {
                fulfill(tagsUpdated);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

}
