var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var canvas2 = document.getElementById("secondaryCanvas");
var ctx2 = canvas2.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var img = document.getElementById("scream");
img.onload = function(){
     var image_data = get_image_data(img);
     var half_images = image_to_half_images(image_data);
     var coords_x = [half_images[0]];
     var coords_y = [half_images[1]];
     for(var y=0; y<3; y++){
          for(var x=0; x<5; x++){
               
               draw_image(img, 10+x*266, 10+y*266, "Hello, this is my", "world...");
          }
     }
}

function get_image_data(img){
     ctx2.drawImage(img, 0, 0, 128, 95);
     return ctx2.getImageData(0, 0, 128, 95);
}

function draw_image(img, screen_x, screen_y, text1, text2){
     ctx.drawImage(img, screen_x, screen_y, 2*128, 2*95);
     var imgData = ctx.getImageData(screen_x, screen_y, 2*128, 2*95);
     var half_images = image_to_half_images(imgData);
     ctx.putImageData(half_images_to_image(half_images[0], half_images[1]), screen_x, screen_y);

     ctx.fillStyle = "white";
     ctx.fillRect(screen_x, screen_y+2*95, 2*128, 2*33);

     ctx.fillStyle = "black"
     ctx.font = "26px Arial";
     ctx.fillText(text1, screen_x+10, screen_y+2*110);
     ctx.fillText(text2, screen_x+10, screen_y+2*124);
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
