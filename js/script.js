'use strict';

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
            for(var key in item){
                var pattern = new RegExp("{\\*"+key+"\\*}",'g');
                item.correspondingTemplate = item.correspondingTemplate.replace(pattern,item[key]);
                menuCorrespondingTemplate = menuCorrespondingTemplate.replace(pattern,item[key]);
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
    };

    var selectedEditor,currentState;

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
            toggle();
        });

        $('.code-reader').each(function(i,codeReader) {
            var textAreaDom = $(codeReader).find('textarea')[0];


            var jsEditor = CodeMirror.fromTextArea(textAreaDom, {
                lineNumbers: true,
                mode: 'javascript',
                theme: 'material',
                indentUnit: 4,
                extraKeys: {
                    "F11": function(cm) {
                        if(!cm.getOption("fullScreen")){

                            selectedEditor = jsEditor;
                            close();

                        }
                        else{
                            open();
                        }

                        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                    },
                    "Esc": function(cm) {
                        if(toggle.state)
                            open();
                        $('.menu-over').removeClass("w3-hide");
                        if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                    }
                }
            });

            jsEditor.on('change',function() {
                var item = bgnSmJS.jsList[i];
                item.codeString = jsEditor.getValue();
                try{
                    item.function = new Function("return ("+jsEditor.getValue()+")")();
                } catch(error){
                    item.functionError = error;
                }

            });


            $(codeReader).find('.fullscreen').on('click',function() {
                if(!jsEditor.getOption("fullScreen")){
                    if(toggle.state === undefined && document.body.clientWidth >= 986)
                        toggle.state = true;

                    selectedEditor = jsEditor;
                    

                    $('.menu-over').addClass("w3-hide");
                    close();
                }
                else{
                    $('.menu-over').removeClass("w3-hide");
                    open();
                }
                jsEditor.setOption("fullScreen", !jsEditor.getOption("fullScreen"));
                jsEditor.focus();

            });


        });

        $(window).on('popstate', function(event,data) {
            if(location.hash.indexOf('fullscreen') === -1){
                if(toggle.state)
                    open();
                
                $('.menu-over').removeClass("w3-hide");
                selectedEditor.setOption("fullScreen", false);
            }

        });


        bgnSmJS.jsListForEach(function(item,i) {
            addTestingModule(item);
        });
    })
    .catch(function(error) {
        console.log(error);
    });
});