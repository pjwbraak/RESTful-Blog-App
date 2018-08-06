var fadeTime    = 400,
    showTime    = 2200,
    slideSpeed  = 200;

$(document).ready(function(){
    
    setTimeout(function(){ $(".flashMessageWrapperSuccess").fadeOut(fadeTime); }, showTime);
    
    $("#commentInput").slideUp(0);
    
    $("#addComment").on("click", function(){
        $("#commentInput").slideToggle(slideSpeed, function(){
            if ($("#commentInput").is(':visible')){
                $(".angle.icon.up.addComment").css("display", "inline");
                $(".dropdown.icon.addComment").css("display", "none");
            } else {
                $(".angle.icon.up.addComment").css("display", "none");
                $(".dropdown.icon.addComment").css("display", "inline");
            }
        });
    });
    
    $("#deleteBlogButton").on("click", function(){
       $('.ui.modal')
        .modal('show')
        ;
    });

});

//not used
function goBack() {
    window.history.back();
}