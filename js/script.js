'use strict';

/*Services*/
var apiServices = apiServices();
var validationServices = validationServices();


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


            item.menuDom = $(menuCorrespondingTemplate).appendTo('#'+bgnSmJS.menuContainer.id);
            item.templateDom = $(item.correspondingTemplate).appendTo('#'+bgnSmJS.codesContainer.id);


            if(i+1==bgnSmJS.jsList.length){
                dfd.resolve(bgnSmJS);
            }

        });
    });

    return dfd.promise();
}

function validateValue(value) {
    if(isNaN(value)){
        return false;
    } else {
        value = +value;
        if(validationServices.isInt(value)){
            return true;
        } else {
            return false;
        }
    }
}

function addTestingModule(item) {

    var testContainer = item.templateDom.find('.test-container');
    testContainer.find('button').on('click',function(event) {
        var value = testContainer.find('input').val();
        if(validateValue(value)){
            value = +value;
            var result = item.function(value);
        } else {
            var result = "Invalid Input";    
        }
        testContainer.find('.result').html(result+"");
    });
}

function compileErrorModule(errStatus,item) {
    var compileContainer = item.templateDom.find('.compile-container');
    if(errStatus){
        compileContainer.find('.error-box').show();
        compileContainer.find('.error-content').text(item.functionError);
    } else {
        compileContainer.find('.error-box').hide();
    }
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

        bgnSmJS.jsListForEach(function(item,i) {

            var textAreaDom = item.templateDom.find('textarea')[0];


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
                item.codeString = jsEditor.getValue();
                try{
                    item.function = new Function("return ("+jsEditor.getValue()+")")();
                    compileErrorModule(false,item);
                } catch(error){
                    item.functionError = error;
                    compileErrorModule(true,item);
                }

            });

            item.templateDom.find('.fullscreen').on('click',function() {
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

            addTestingModule(item);

        });

        $(window).on('popstate', function(event,data) {
            if(location.hash.indexOf('fullscreen') === -1){
                if(toggle.state)
                    open();
                
                $('.menu-over').removeClass("w3-hide");
                selectedEditor.setOption("fullScreen", false);
            }

        });

    })
    .catch(function(error) {
        console.log(error);
    });
});