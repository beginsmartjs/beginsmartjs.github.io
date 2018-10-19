/*Services*/
var apiServices = apiServices();


function bootstrapTemplate(bgnSmJS) {
    var dfd = jQuery.Deferred();
    bgnSmJS.jsList.forEach(function(item,i) {
        item.correspondingTemplate = bgnSmJS.codesContainer.listTemplate;
        apiServices.getCode(item.id)
        .then(function(response) {
            item.codeString = response;
            item.function = new Function("return ("+response+")")();
            for(key in item){
                item.correspondingTemplate = item.correspondingTemplate.replace('{*'+key+'*}',item[key]);
            }

            $('#'+bgnSmJS.codesContainer.id).append(item.correspondingTemplate);

            if(i+1==bgnSmJS.jsList.length){
                dfd.resolve(bgnSmJS);
            }

        });
    });

    return dfd.promise();
}

function addTestingModule(bgnSmJS) {
    bgnSmJS.jsList.forEach(function(item,i) {
        var testContainer = $('#'+item.id+' .test-container');
        testContainer.find('button').on('click',function(event) {
            var value = testContainer.find('input').val();
            value = +value;
            var result = item.function(value);
            testContainer.find('.result').html(result+"");
        });
    });
}

$(document).ready(function(){
    var bgnSmJS = {
        jsList:[],
        codesContainer:{
            id: "codes-container",
            listTemplate:""
        }
    }

    apiServices.getMetaCodes()
    .then(function(response) {
        bgnSmJS.jsList = response;
        return apiServices.getCodeBoxTemplate()
    })
    .then(function(response) {
        bgnSmJS.codesContainer.listTemplate = response;
        return bootstrapTemplate(bgnSmJS);
    })
    .then(function() {
        hljs.configure({
            tabReplace:'    '
        });
        hljs.initHighlighting();
        addTestingModule(bgnSmJS);
    })
    .catch(function(error) {
        console.log(error);
    });
});