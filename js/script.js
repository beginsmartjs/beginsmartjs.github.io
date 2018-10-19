/*Services*/
var apiServices = apiServices();


function bootstrapTemplate(bgnSmJS) {
    var dfd = jQuery.Deferred();
    bgnSmJS.jsList.forEach(function(item,i) {
        item.correspondingTemplate = bgnSmJS.codesContainer.listTemplate;
        var  menuCorrespondingTemplate = bgnSmJS.menuContainer.menuTemplate;
        apiServices.getCode(item.id)
        .then(function(response) {
            item.codeString = response;
            item.function = new Function("return ("+response+")")();
            for(key in item){
                item.correspondingTemplate = item.correspondingTemplate.replace('{*'+key+'*}',item[key]);
                menuCorrespondingTemplate = menuCorrespondingTemplate.replace('{*'+key+'*}',item[key]);
            }


            $('#'+bgnSmJS.menuContainer.id).append(menuCorrespondingTemplate);

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
        menuContainer:{
            id:"programs-list",
            menuTemplate:"<a href=\"#{*id*}\" class=\"w3-bar-item w3-button\">{*header*}</a>"
        },
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

        $('#'+bgnSmJS.menuContainer.id).find('a').on('click',function() {
            openClose();
        });

        $('textarea').each(function(i,dom) {
            var jsEditor = CodeMirror.fromTextArea(dom, {
                lineNumbers: true,
                mode: 'javascript',
                theme: 'material',
                indentUnit: 4
            });
        })

        bgnSmJS.jsListForEach(function(item,i) {
            addTestingModule(item);
        });
    })
    .catch(function(error) {
        console.log(error);
    });
});