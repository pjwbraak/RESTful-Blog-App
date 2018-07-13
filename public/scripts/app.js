var fadeTime = 400,
    showTime = 2500;

$(document).ready(function(){
    
    setTimeout(function(){ $(".flashMessageWrapperSuccess").fadeOut(fadeTime); }, showTime);
    
});

//not used
function goBack() {
    window.history.back();
}