'use strict';

module.exports = {

    beforeCreate: function(object, cb) {
        object = removeEmptyString(object);
        cb();
    },
    
    beforeUpdate: function(object, cb) {
        object = removeEmptyString(object);
        cb();
    }

}

function removeEmptyString(data){
    for (var key in data) {
        if(data[key] === ''){
            data[key] = null;  
        } 
    };
    return data;
};