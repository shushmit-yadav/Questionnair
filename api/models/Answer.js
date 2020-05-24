'use strict';

module.exports = _.merge(_.cloneDeep(require('../base/Model')), {

    tableName: 'answer',
    fetchRecordsOnCreate: true,
    fetchRecordsOnUpdate: true,

    attribute: {
        
        question: {
            model: 'Question',
            required: true
        },
        description: {
            type: 'string'
        },
        isAccepted: {
            type: 'boolean',
            IsIn: [true, false],
            defaultsTo: false
        },
        votes: {
            type: 'integer',
            defaultsTo: 0
        }
    }

});