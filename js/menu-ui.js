

// Script to open and close sidebar
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
    console.log("coming",document.getElementById("mySidebar"));
    document.getElementById("mySidebar").style.display = "none!important";
    document.getElementById("myOverlay").style.display = "none!important";
}