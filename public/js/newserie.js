$(document).on("change", "#languageDrop", function(){
    let inputLang = document.getElementById("language");
    let dropdownLang = document.getElementById("languageDrop");
    if(dropdownLang.value=="Overig") {
        inputLang.hidden=false;
        inputLang.value="";
    } else {
        inputLang.hidden=true;
        inputLang.value=dropdownLang.value;
    }
});

$(document).on("click", "#btnLocation", function() {
    
});