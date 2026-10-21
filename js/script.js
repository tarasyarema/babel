var scale = 2;


var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var canvas2 = document.getElementById("secondaryCanvas");
var ctx2 = canvas2.getContext("2d");
canvas2.width = 128;
canvas2.height = 95;

var draw_count, draw_count_target;
var img_element = document.getElementById("hidden_image");
var image_ready = false;
img_element.onload = function(){
     image_ready = true;
     start_gallery();
}
img_element.src = "img/start.png";
function start_gallery(){
     if(!image_ready || !comments_ready)
          return;

     resize_things();

     var image_data = get_image_data(img_element);
     put_image_in_center(image_data);
     draw_last_posts();
}

var current_x, current_y;
function put_image_in_center(image_data, of_x, of_y){
     var half_images = image_to_half_images(image_data);
     current_x = half_images[0];
     current_y = half_images[1];
     draw_images();
}

function draw_images(){
     loaded = true;
     ctx.clearRect(0, 0, canvas.width, canvas.height);
     var maxX = Math.ceil((canvas.width/scale-5)/133/2);
     var coords_x = [];
     coords_x[maxX] = current_x;
     var coords_y = [previous_half_image(current_y), current_y, next_half_image(current_y)];
     for(var x=maxX+1; x<=2*maxX; x++)
          coords_x[x] = next_half_image(coords_x[x-1]);
     for(var x=maxX-1; x>=0; x--)
          coords_x[x] = previous_half_image(coords_x[x+1]);

     var offsetX = -133*maxX+(canvas.width/scale-133)/2;
     draw_count = 0;
     draw_count_target = 3*(2*maxX+1);
     for(var y=0; y<3; y++){
          for(var x=0; x<=2*maxX; x++){
               var imgData = half_images_to_image(coords_x[x], coords_y[y]);
               var cmt1, cmt2;
               [cmt1, cmt2] = get_text_lines(get_comment_for_image(imgData));
               draw_image_from_data_without_dom(imgData, offsetX+x*133, 5+y*133, cmt1, cmt2);
          }
     }
     draw_scrollbars();
}
function get_text_lines(full_comment){
     var cmt1, cmt2;
     if(full_comment != ""){
          var words = full_comment.split(" ");
          var str = words[0];
          var i;
          for(i=1; i<words.length; i++){
               if(ctx.measureText(str + " " + words[i]).width > 123){
                    break;
               }
               str += " " + words[i];
          }
          cmt1 = str;
          cmt2 = "";
          for(var j=i; j<words.length; j++){
               cmt2 += " "+words[j];
          }
     }else{
          cmt1 = "";
          cmt2 = "";
     }
     return [cmt1, cmt2];
}

// Center-crops any image, video frame or photo to 128x95 so it isn't stretched.
function get_image_data(img, mirror){
     var w = img.videoWidth || img.naturalWidth || img.width;
     var h = img.videoHeight || img.naturalHeight || img.height;
     var crop_w = Math.min(w, h*128/95);
     var crop_h = crop_w*95/128;
     ctx2.save();
     ctx2.fillStyle = "white";
     ctx2.fillRect(0, 0, 128, 95);
     if(mirror){
          ctx2.translate(128, 0);
          ctx2.scale(-1, 1);
     }
     ctx2.drawImage(img, (w-crop_w)/2, (h-crop_h)/2, crop_w, crop_h, 0, 0, 128, 95);
     ctx2.restore();
     return ctx2.getImageData(0, 0, 128, 95);
}

function draw_image_from_data_without_dom(imgData, screen_x, screen_y, text1, text2){
     ctx2.putImageData(imgData, 0, 0);

     ctx.drawImage(canvas2, screen_x, screen_y);

     ctx.fillStyle = "white";
     ctx.fillRect(screen_x, screen_y+95, 128, 33);

     ctx.fillStyle = "black"
     ctx.fillText(text1, screen_x+5, screen_y+110);
     ctx.fillText(text2, screen_x+5, screen_y+124);

     ctx.strokeStyle = "#CCC";
     ctx.strokeRect(screen_x, screen_y, 128, 128);
}
function draw_image_posts(img, screen_x, screen_y, text1, text2){
     lpctx.drawImage(img, screen_x, screen_y);

     lpctx.fillStyle = "white";
     lpctx.fillRect(screen_x, screen_y+95, 128, 33);

     lpctx.fillStyle = "black"
     lpctx.fillText(text1, screen_x+5, screen_y+110);
     lpctx.fillText(text2, screen_x+5, screen_y+124);

     lpctx.strokeStyle = "#CCC";
     lpctx.strokeRect(screen_x, screen_y, 128, 128);
}

function next_half_image(imgData){
     var result = new ImageData(imgData.width, imgData.height);
     result.data = new Uint8ClampedArray(imgData.data.length);
     for(var i=0; i<result.data.length; i++)
          result.data[i] = imgData.data[i];
     for(var i=result.data.length-4; i>=0; i-=4){
          if(result.data[i+2] < 255){
               result.data[i+2]++;
               break;
          }else{
               result.data[i+2] = 0;
          }
          if(result.data[i+1] < 255){
               result.data[i+1]++;
               break;
          }else{
               result.data[i+1] = 0;
          }
          if(result.data[i] < 255){
               result.data[i]++;
               break;
          }else{
               result.data[i] = 0;
          }
     }
     return result;
}
function previous_half_image(imgData){
     var result = new ImageData(imgData.width, imgData.height);
     result.data = new Uint8ClampedArray(imgData.data.length);
     for(var i=0; i<result.data.length; i++)
          result.data[i] = imgData.data[i];
     for(var i=result.data.length-4; i>=0; i-=4){
          if(result.data[i+2] > 0){
               result.data[i+2]--;
               break;
          }else{
               result.data[i+2] = 255;
          }
          if(result.data[i+1] > 0){
               result.data[i+1]--;
               break;
          }else{
               result.data[i+1] = 255;
          }
          if(result.data[i] > 0){
               result.data[i]--;
               break;
          }else{
               result.data[i] = 255;
          }
     }
     return result;
}
function half_images_to_image(imgData1, imgData2){
     var result = new ImageData(imgData1.width*2, imgData1.height);
     result.data = new Uint8ClampedArray(2*imgData1.data.length);
     for(var i=0, j=0; i<imgData1.data.length; i+=4, j+=8){
          result.data[j]   = imgData1.data[i];
          result.data[j+1] = imgData1.data[i+1];
          result.data[j+2] = imgData1.data[i+2];
          result.data[j+3] = imgData1.data[i+3];
          result.data[j+4] = imgData2.data[i];
          result.data[j+5] = imgData2.data[i+1];
          result.data[j+6] = imgData2.data[i+2];
          result.data[j+7] = imgData2.data[i+3];
     }
     return result;
}

function image_to_half_images(imgData){
     var result1 = new ImageData(imgData.width/2, imgData.height);
     var result2 = new ImageData(imgData.width/2, imgData.height);
     result1.data = new Uint8ClampedArray(imgData.data.length/2);
     result2.data = new Uint8ClampedArray(imgData.data.length/2);
     for(var i=0, j=0; i<imgData.data.length; i+=8, j+=4){
          result1.data[j]   = imgData.data[i];
          result1.data[j+1] = imgData.data[i+1];
          result1.data[j+2] = imgData.data[i+2];
          result1.data[j+3] = imgData.data[i+3];
          result2.data[j]   = imgData.data[i+4];
          result2.data[j+1] = imgData.data[i+5];
          result2.data[j+2] = imgData.data[i+6];
          result2.data[j+3] = imgData.data[i+7];
     }

     return [result1, result2];
}

function get_proportion_from_image(imgData){
     return ((imgData.data[0] << 16)+(imgData.data[1] << 8)+imgData.data[2])/16777216;
}
function draw_scrollbars(){
     var place_x = 0, place_y = 0;
     place_x = 10+(canvas.width/scale -20) * get_proportion_from_image(current_x);
     place_y = 10+(canvas.height/scale-20) * get_proportion_from_image(current_y);
     ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
     ctx.fillRect(0, canvas.height/scale-6, canvas.width/scale, 6);
     ctx.fillRect(canvas.width/scale-6, 0, 6, canvas.height/scale);
     ctx.fillStyle = "black";
     ctx.fillRect(place_x-10, canvas.height/scale-6, 20, 6);
     ctx.fillRect(canvas.width/scale-6, place_y-10, 6, 20);
}

var loaded = false;
// Canvases fill their CSS box and render at device pixel ratio so text stays sharp.
function resize_things(){
     var dpr = window.devicePixelRatio || 1;
     canvas.width = canvas.clientWidth*dpr;
     canvas.height = canvas.clientHeight*dpr;
     scale = canvas.height/(3*133+5);
     ctx.scale(scale, scale);
     ctx.font = "10px Oxygen, sans-serif";

     var rows = Math.max(1, Math.ceil(Math.min(Object.keys(all_comments).length, 10)/2));
     lastPostsCanvas.width = lastPostsCanvas.clientWidth*dpr;
     lastPostsCanvas.height = lastPostsCanvas.width*rows*133/261;
     lpctx.scale(lastPostsCanvas.width/261, lastPostsCanvas.width/261);
     lpctx.font = "10px Oxygen, sans-serif";

     if(loaded){
          draw_images();
          draw_last_posts();
     }
}
window.onresize = resize_things;

function load_half_image_at_proportion(place){
     var result = new ImageData(64, 95);
     var size = 64*95*4;
     result.data = new Uint8ClampedArray(size);
     if(place == 0){
          for(var i=0; i<size; i+=4){
               result.data[i]   = 0;
               result.data[i+1] = 0;
               result.data[i+2] = 0;
               result.data[i+3] = 255;
          }
     }else if(place == 1){
          for(var i=0; i<size; i+=4){
               result.data[i]   = 255;
               result.data[i+1] = 255;
               result.data[i+2] = 255;
               result.data[i+3] = 255;
          }
     }else{
          var prop = parseInt(place*256*256*256);
          result.data[0] = (prop & (255 << 16)) >> 16;
          result.data[1] = (prop & (255 <<  8)) >> 8;
          result.data[2] = prop & 255;
          result.data[2] = 255;
          for(var i=4; i<size; i+=4){
               result.data[i] = parseInt(256*Math.random());
               result.data[i+1] = parseInt(256*Math.random());
               result.data[i+2] = parseInt(256*Math.random());
               result.data[i+3] = 255;
          }
     }
     return result;
}

var animation_duration_per_axis = 600;
var animation_start_time;
var animation_to_x, animation_to_y, animation_from_x, animation_from_y;
var animation_final_x, animation_final_y;
function start_animation_towards(to_x, to_y){
     animation_start_time = new Date().getTime();
     animation_final_x = to_x;
     animation_final_y = to_y;
     animation_to_x = get_proportion_from_image(to_x);
     animation_to_y = get_proportion_from_image(to_y);
     animation_from_x = get_proportion_from_image(current_x);
     animation_from_y = get_proportion_from_image(current_y);
     do_animation_for_x();
}

function do_animation_for_x(){
     var time = new Date().getTime();
     var t = (time-animation_start_time)/animation_duration_per_axis;
     if(t < 1){
          t = 0.5-0.5*Math.cos(t*Math.PI);
          var prop = animation_from_x+t*(animation_to_x-animation_from_x);
          current_x = load_half_image_at_proportion(prop);
          draw_images();
          requestAnimationFrame(do_animation_for_x);
     }else{
          current_x = animation_final_x;
          animation_start_time = new Date().getTime();
          do_animation_for_y();
     }
}
function do_animation_for_y(){
     var time = new Date().getTime();
     var t = (time-animation_start_time)/animation_duration_per_axis;
     if(t < 1){
          t = 0.5-0.5*Math.cos(t*Math.PI);
          var prop = animation_from_y+t*(animation_to_y-animation_from_y);
          current_y = load_half_image_at_proportion(prop);
          draw_images();
          requestAnimationFrame(do_animation_for_y);
     }else{
          current_y = animation_final_y;
          draw_images();
     }
}



// Pointer events cover mouse, touch and pen. The whole bottom and right edges
// act as scrollbar tracks so they are easy to grab with a finger.
var on_scroll = 0;
var swipe_start = null;
function canvas_point(e){
     var rect = canvas.getBoundingClientRect();
     var ratio = canvas.width/rect.width/scale;
     return [(e.clientX-rect.left)*ratio, (e.clientY-rect.top)*ratio];
}
canvas.onpointerdown = function(e){
     if(!loaded)
          return;
     var p = canvas_point(e);
     swipe_start = null;
     if(p[1] >= canvas.height/scale-14)
          on_scroll = 1;
     else if(p[0] >= canvas.width/scale-14)
          on_scroll = 2;
     else{
          on_scroll = 0;
          swipe_start = p;
     }
     canvas.setPointerCapture(e.pointerId);
     canvas.onpointermove(e);
}
canvas.onpointerup = canvas.onpointercancel = function(e){
     if(swipe_start && e.type == "pointerup"){
          var p = canvas_point(e);
          var dx = p[0]-swipe_start[0], dy = p[1]-swipe_start[1];
          if(Math.max(Math.abs(dx), Math.abs(dy)) > 20){
               if(Math.abs(dx) > Math.abs(dy))
                    current_x = dx < 0 ? next_half_image(current_x) : previous_half_image(current_x);
               else
                    current_y = dy < 0 ? next_half_image(current_y) : previous_half_image(current_y);
               draw_images();
          }
     }
     on_scroll = 0;
     swipe_start = null;
}
canvas.onpointermove = function(e){
     if(on_scroll == 0)
          return;
     var pt = canvas_point(e);
     if(on_scroll == 1){
          var p = (pt[0]-10)/(canvas.width/scale-20);
          if(p > 1)
               p = 1;
          else if(p < 0)
               p = 0;
          current_x = load_half_image_at_proportion(p);
          draw_images();
     }else if(on_scroll == 2){
          var p = (pt[1]-10)/(canvas.height/scale-20);
          if(p > 1)
               p = 1;
          else if(p < 0)
               p = 0;
          current_y = load_half_image_at_proportion(p);
          draw_images();
     }
}
window.onkeydown = function(e){
     switch(e.keyCode){
          case 37: // Left
               current_x = previous_half_image(current_x);
               draw_images();
               break;
          case 38: // Up
               current_y = previous_half_image(current_y);
               draw_images();
               break;
          case 39: // Right
               current_x = next_half_image(current_x);
               draw_images();
               break;
          case 40: // Down
               current_y = next_half_image(current_y);
               draw_images();
               break;
     }
}
