'use strict';

function open() {

    $("#sidebar").animate({left: "0%"});

    $(".menu-bar-button")
    .animate({left: "300px"});

    $(".code-area").addClass("menu-impact");
}

function close() {

    $("#sidebar").animate({left: "-100%"});

    $(".menu-bar-button")
    .animate({left: "0px"});

    $(".code-area").removeClass("menu-impact");
}
var toggle = function toggle(desktop) {

    if(toggle.state!==undefined){

        toggle.state = !toggle.state;
    }
    else{
        if(desktop)
            toggle.state = false;
        else
            toggle.state=true;
    }
    if(toggle.state){
        open();
        $(".menu-bar-button")
        .toggleClass("change");
    }
    else{
        close();
        $(".menu-bar-button")
        .toggleClass("change");
    }
}


