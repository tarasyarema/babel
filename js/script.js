var scale = 2;


var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var canvas2 = document.getElementById("secondaryCanvas");
var ctx2 = canvas2.getContext("2d");

resize_things();

var draw_count, draw_count_target;
var img_element = document.getElementById("hidden_image");
img_element.onload = function(){
     var image_data = get_image_data(img_element);
     put_image_in_center(image_data);
}

var current_x, current_y;
function put_image_in_center(image_data, of_x, of_y){
     var half_images = image_to_half_images(image_data);
     current_x = half_images[0];
     current_y = half_images[1];
     draw_images();
}

function draw_images(){
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
               draw_image_from_data_without_dom(imgData, offsetX+x*133, 5+y*133, "Hello, this is my", "world...");
          }
     }
}

function get_image_data(img){
     ctx2.drawImage(img, 0, 0, 128, 95);
     return ctx2.getImageData(0, 0, 128, 95);
}

function draw_image(img, screen_x, screen_y, text1, text2){
     ctx.drawImage(img, screen_x, screen_y, 2*128, 2*95);

     ctx.fillStyle = "white";
     ctx.fillRect(screen_x, screen_y+2*95, 2*128, 2*33);

     ctx.fillStyle = "black"
     ctx.font = '26px "Trebuchet MS", Helvetica, sans-serif';
     ctx.fillText(text1, screen_x+10, screen_y+2*110);
     ctx.fillText(text2, screen_x+10, screen_y+2*124);
}

function draw_image_from_data_with_dom(imgData, screen_x, screen_y, text1, text2){
     ctx2.putImageData(imgData, 0, 0);
     var new_img_element = document.createElement("img");
     new_img_element.onload = function(){
          ctx.drawImage(new_img_element, screen_x, screen_y);

          ctx.fillStyle = "white";
          ctx.fillRect(screen_x, screen_y+95, 128, 33);

          ctx.fillStyle = "black"
          ctx.font = "13px Arial";
          ctx.fillText(text1, screen_x+10, screen_y+110);
          ctx.fillText(text2, screen_x+10, screen_y+124);

          draw_count++;
          if(draw_count == draw_count_target)
               draw_scrollbars();
     }
     new_img_element.src = canvas2.toDataURL();
}
function draw_image_from_data_without_dom(imgData, screen_x, screen_y, text1, text2){
     ctx2.putImageData(imgData, 0, 0);

     ctx.drawImage(canvas2, screen_x, screen_y);

     ctx.fillStyle = "white";
     ctx.fillRect(screen_x, screen_y+95, 128, 33);

     ctx.fillStyle = "black"
     ctx.font = "13px Arial";
     ctx.fillText(text1, screen_x+10, screen_y+110);
     ctx.fillText(text2, screen_x+10, screen_y+124);

     draw_count++;
     if(draw_count == draw_count_target)
          draw_scrollbars();
}
function draw_image_from_data_no_resize(imgData, screen_x, screen_y, text1, text2){
     ctx.putImageData(imgData, screen_x, screen_y);

     ctx.fillStyle = "white";
     ctx.fillRect(screen_x, screen_y+95, 128, 33);

     ctx.fillStyle = "black"
     ctx.font = "13px Arial";
     ctx.fillText(text1, screen_x+10, screen_y+110);
     ctx.fillText(text2, screen_x+10, screen_y+124);

     draw_count++;
     if(draw_count == draw_count_target)
          draw_scrollbars();
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

var scrollbar_x = [];
var scrollbar_y = [];
function get_proportion_from_image(imgData){
     return ((imgData.data[0] << 16)+(imgData.data[1] << 8)+imgData.data[2])/16777216;
}
function draw_scrollbars(){
     var place_x = 0, place_y = 0;
     place_x = canvas.width/scale  * get_proportion_from_image(current_x);
     place_y = canvas.height/scale * get_proportion_from_image(current_y);
     ctx.fillRect(place_x-10, canvas.height/scale-6, 20, 6);
     ctx.fillRect(canvas.width/scale-6, place_y-10, 6, 20);
     scrollbar_x = [place_x-10, canvas.height/scale-6, place_x-10+20, canvas.height/scale-6+6];
     scrollbar_y = [canvas.width/scale-6, place_y-10, canvas.width/scale-6+6, place_y-10+20];
}


function resize_things(){
     canvas.width = 0.6*window.innerWidth;
     canvas.height = window.innerHeight;
     scale = canvas.height/(3*133+5);
     ctx.scale(scale, scale);

     document.getElementById("rightTab").style.width = 0.4*window.innerWidth-90;
     document.getElementById("my_camera").style.width = 0.4*window.innerWidth-90;
     document.getElementById("my_camera").style.height = 0.75*(0.4*window.innerWidth-90);
     document.querySelector("#my_camera video").style.width = 0.4*window.innerWidth-90;
     document.querySelector("#my_camera video").style.height = 0.75*(0.4*window.innerWidth-90);
}
window.onresize = resize_things;

function load_half_image_at_proportion(place){
     var result = new ImageData(64, 95);
     var size = 64*95*4;
     result.data = new Uint8ClampedArray(size);
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



var on_scroll = 0;
window.onmousedown = function(e){
     var cx = e.clientX/scale;
     var cy = e.clientY/scale;
     if(cx >= scrollbar_x[0] && cy >= scrollbar_x[1] && cx <= scrollbar_x[2] && cy <= scrollbar_x[3]){
          on_scroll = 1;
     }else if(cx >= scrollbar_y[0] && cy >= scrollbar_y[1] && cx <= scrollbar_y[2] && cy <= scrollbar_y[3]){
          on_scroll = 2;
     }else
          on_scroll = 0;
}
window.onmouseup = function(){
     on_scroll = 0;
}
window.onmousemove = function(e){
     if(on_scroll == 1){
          current_x = load_half_image_at_proportion(e.clientX/canvas.width);
          draw_images();
     }else if(on_scroll == 2){
          current_y = load_half_image_at_proportion(e.clientY/canvas.height);
          draw_images();
     }
}
