var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var img = document.getElementById("scream");
for(var y=0; y<3; y++){
     for(var x=0; x<5; x++){
          draw_image(img, 10+x*266, 10+y*266, "Hello, this is my", "world...");
     }
}

function draw_image(imgRight, imgLeft, screen_x, screen_y, text1, text2){
     ctx.drawImage(img, screen_x, screen_y, 2*128, 2*95);

     ctx.fillStyle = "white";
     ctx.fillRect(screen_x, screen_y+2*95, 2*128, 2*33);

     ctx.fillStyle = "black"
     ctx.font = "26px Arial";
     ctx.fillText(text1, screen_x+10, screen_y+2*110);
     ctx.fillText(text2, screen_x+10, screen_y+2*124);

     console.log(ctx.getImageData(screen_x, screen_y, 2*128, 2*95));
}

function draw_image_from_data(imgData, screen_x, screen_y){

}

function next_half_image(imgData){
     var result = imgData;
     for(var i=imgData.length-4; i>=0; i-=4){
          if(imgData[i+2] < 255){
               imgData[i+2]++;
               break;
          }
          if(imgData[i+1] < 255){
               imgData[i+1]++;
               break;
          }
          if(imgData[i] < 255){
               imgData[i]++;
               break;
          }
     }
}
function previous_half_image(imgData){
     var result = imgData;
     for(var i=imgData.length-4; i>=0; i-=4){
          if(imgData[i+2] > 0){
               imgData[i+2]--;
               break;
          }
          if(imgData[i+1] > 0){
               imgData[i+1]--;
               break;
          }
          if(imgData[i] > 0){
               imgData[i]--;
               break;
          }
     }
}
function half_image_to_image(imgData, position_offset){
     var result = imgData;
     result.width *= 2;
     result.data = Uint8ClampedArray(imgData.data.length);
     for(var i=0; i<imgData.length; i+=4){
          result.data[2*i+offset]   = imgData.data[i];
          result.data[2*i+offset+1] = imgData.data[i+1];
          result.data[2*i+offset+2] = imgData.data[i+2];
          result.data[2*i+offset+3] = imgData.data[i+3];
     }
     return result;
}
