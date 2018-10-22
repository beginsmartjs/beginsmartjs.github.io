'use strict';

function apiServices() {
    var as = {};

    as.getMetaCodes = function() {
    	var dfd = jQuery.Deferred();

		$.get("./jsons/meta-codes.json")
                .done(function(response) {
                    dfd.resolve(response);
                })
                .catch(function(error) {
                	dfd.reject(error);
                });

        return dfd.promise();
    }

    as.getCodeBoxTemplate = function() {
    	var dfd = jQuery.Deferred();

		$.get("./templates/code-box.html")
                .done(function(response) {
                    dfd.resolve(response);
                })
                .catch(function(error) {
                	dfd.reject(error);
                });

        return dfd.promise();
    }


    as.getCode = function(id) {
    	var dfd = jQuery.Deferred();

		$.get("./js/listofcodes/"+id+".js")
                .done(function(response) {
                    dfd.resolve(response);
                })
                .catch(function(error) {
                	dfd.reject(error);
                });

        return dfd.promise();
    }

    return as;
};