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


function addTestingModule(item) {
    var testContainer = $('#'+item.id+' .test-container');
    testContainer.find('button').on('click',function(event) {
        var value = testContainer.find('input').val();
        value = +value;
        var result = item.function(value);
        testContainer.find('.result').html(result+"");
    });
}

$(document).ready(function(){
    var bgnSmJS = {
        jsList:[],
        codesContainer:{
            id: "codes-container",
            listTemplate:""
        },
        jsListForEach:function(cb) {
            var self = this;
            this.jsList.forEach(function() {
                if(typeof cb === 'function')
                    cb.apply(self,arguments);
                else
                    throw new Error("expecting function");
            })
            
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
        bgnSmJS.jsListForEach(function(item,i) {
            addTestingModule(item);
        });
    })
    .catch(function(error) {
        console.log(error);
    });
});