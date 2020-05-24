'use strict';

module.exports = _.merge(_.cloneDeep(require('../base/Model')), {

    tableName: 'tag',
    fetchRecordsOnCreate: true,
    fetchRecordsOnUpdate: true,

    attributes: {
        
        name: {
            type: 'string',
            required: true
        }

    },

    beforeCreate: (obj, cb) => {
        obj['name'] = obj['name'].toUpperCase();
        cb();
    }
});