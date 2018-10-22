'use strict';

function validationServices() {
    var vs = {};
    vs.isInt = function(n){
        return Number(n) === n && n % 1 === 0;
    }

    vs.isFloat = function(n){
        return Number(n) === n && n % 1 !== 0;
    }

    return vs;
};