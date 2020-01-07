$("img").on("click", function(){
    let url =  "/series/" +$(this).attr("id").split(".j",1)
    window.location.href = url;
});