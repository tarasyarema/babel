var all_comments = [];
var comments_ready = false;
$(function(){
     $.getJSON("php/db.json", function(data){
          all_comments = data;
          comments_ready = true;
          start_gallery();
     });
});

function get_comment_for_image(imgData){
     ctx2.putImageData(imgData, 0, 0);
     var imgCode = canvas2.toDataURL();
     if(all_comments[imgCode] == undefined)
          return "";
     else {
          return all_comments[imgCode];
     }
}
