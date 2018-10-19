function apiServices() {
    var apiServices = {};

    apiServices.getMetaCodes = function() {
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

    apiServices.getCodeBoxTemplate = function() {
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


    apiServices.getCode = function(id) {
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

    return apiServices;
};