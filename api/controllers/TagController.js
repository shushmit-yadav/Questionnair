'use strict';

module.exports = {

    findOrCreateTag: (tagName) => {
        return new Promise((fulfill, reject) => {
            // var tagRegex = 
            sails.models.tag.find({'name': tagName.toUpperCase()})
            .then(tags => {
                if(tags.length > 0){
                    return tags[0];
                } else {
                    return sails.models.tag.create({'name': tagName})
                    .then(tag => {
                        return tag;
                    })
                    .catch(err => {
                        throw err;
                    });
                }   
                // fulfill(tag);
            })
            .then(tag => {
                fulfill(tag);
            })
            .catch(err => {
                reject(err);
            });
        });
    }
    

}