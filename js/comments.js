var all_comments = [];
var comments_ready = false;
$(function(){
     // Comments are a read-only snapshot shipped with the site; posting was removed.
     $.getJSON("data/comments.json", function(data){
          all_comments = data;
     }).always(function(){
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

var lastPostsCanvas = document.getElementById("lastPostsCanvas");
var lpctx = lastPostsCanvas.getContext("2d");

function draw_last_posts(){
     var keys = Object.keys(all_comments).reverse();
     var img = [];
     for(var i=Math.min(keys.length-1, 9); i>=0; i--){
          img[i] = new Image();
          img[i].c_x = i%2 == 0 ? 0 : 133;
          img[i].c_y = Math.floor(i/2)*133;
          img[i].comment = all_comments[keys[i]];
          img[i].onload = function(){
               var cmt1, cmt2;
               [cmt1, cmt2] = get_text_lines(this.comment);
               draw_image_posts(this, this.c_x, this.c_y, cmt1, cmt2);
          };
          img[i].src = keys[i];
     }
}
