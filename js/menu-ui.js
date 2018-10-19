

// Script to open and close sidebar
/*function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
    console.log("coming",document.getElementById("mySidebar"));
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
}*/
function openClose(desktop) {
    if(this.state!==undefined){

        this.state = !this.state;
    }
    else{
        if(desktop)
            this.state = false;
        else
            this.state=true;
    }
    if(this.state){
        $("#sidebar").animate({left: "0%"});


        $(".menu-bar-button")
        .animate({left: "300px"})
        .toggleClass("change");



        $(".code-area").addClass("menu-impact");
    }
    else{

        $("#sidebar").animate({left: "-100%"});
        
        $(".menu-bar-button")
        .animate({left: "0px"})
        .toggleClass("change");


        $(".code-area").removeClass("menu-impact");

    }
}