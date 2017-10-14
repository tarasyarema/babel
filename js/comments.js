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

var postCanvas = document.getElementById("postCanvas");
var pctx = postCanvas.getContext("2d");
var ghostComment = document.getElementById("ghostComment");
ghostComment.onkeyup = function(e){
     var cmt1, cmt2;
     [cmt1, cmt2] = get_text_lines(ghostComment.value);
     if(pctx.measureText(cmt2).width >= 123){
          ghostComment.value = postText.substr(0, postText.length-1);
          [cmt1, cmt2] = get_text_lines(postText);
     }
     draw_image_from_data_post(half_images_to_image(current_x, current_y), 0, 0, cmt1, cmt2);

};

document.getElementById("postComment").onclick = function(){
     if(ghostComment.value != ""){
          var imgData = half_images_to_image(current_x, current_y);
          ctx2.putImageData(imgData, 0, 0);
          var image = canvas2.toDataURL();
          $.post("php/post.php", {image: image, comment: ghostComment.value}, function(data){
               all_comments[image] = ghostComment.value;
               draw_images();
               togglePostButton(true);
          });
     }
}
function togglePostButton(state){
     if(state)
          document.getElementById("postComment").setAttribute("disabled", "disabled");
     else {
          document.getElementById("postComment").removeAttribute("disabled");
     }
}

var lastPostsCanvas = document.getElementById("lastPostsCanvas");
var lpctx = lastPostsCanvas.getContext("2d");
