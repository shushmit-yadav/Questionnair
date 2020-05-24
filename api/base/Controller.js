'use strict';

module.exports = {

    checkRequiredParams: function(req, params) {
        for (var i = 0; i < params.length; ++i) {
            var val = (req.param && typeof(req.param) === "function") ? req.param(params[i]) : req[params[i]];
            (typeof val ==='string')? (val = val.trim()):'';
            if (!val || val === '') {
                var err = new Error("Missing input parameter '" + params[i] + "'");
                return err;
            }
        }
    },
    
    getReqParamVals: function(req, reqParams, optionalParams){
        var retVals = {};
        for (var i = 0; i < reqParams.length; ++i) {
            var val = req.param(reqParams[i]);
            if (!val) {
                var err = new Error("Missing input parameter '" + reqParams[i] + "'");
                return err;
            }else{
                retVals[reqParams[i]] = val;
            }
        }
        if(optionalParams){
            for (var i = 0; i < optionalParams.length; ++i) {
                var val = req.param(optionalParams[i]);
                if (val) {
                    retVals[optionalParams[i]] = val;
                }
            }
        }
        return retVals;
    },


    deleteUndefinedKeys: function(obj){
        for(let key in obj){
            if(obj[key] == undefined){
                delete obj[key];
            }
        }
        return obj;
    }
    
    
};
