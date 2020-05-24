'use strict';

module.exports = {

    getAnswersByQuestionId: (questionId) => {
        return new Promise((fulfill, reject) => {
            sails.models.answer.find({'question': questionId, 'isAccepted': true})
            .then(acceptedAnswers => {
                return acceptedAnswers;
            })
            .then(acceptedAnswers => {
                if(acceptedAnswers.length == 0){
                    
                    return sails.models.answer.find({
                        where: {'question': questionId},
                        sort: 'votes DESC'
                    })
                    .then(answers => {
                        return answers;
                    })
                    .catch(err => {
                        throw err;
                    });

                } else {
                    return acceptedAnswers;
                }
            })
            .then(answers => {
                fulfill(answers);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

}