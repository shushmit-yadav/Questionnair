'use strict';

module.exports = _.merge(_.cloneDeep(require('../base/Model')), {

    tableName: 'question',
    fetchRecordsOnCreate: true,
    fetchRecordsOnUpdate: true,

    attributes: {
        
        name: {
            type: 'string',
            required: true
        },
        description: {
            type: 'string',
            maxLength: 1000
        },
        tags: {
            type: 'json',
            columnType: 'array'
        },
        totalVotes: {
            type: 'integer',
            defaultsTo: 0
        }

    }
})