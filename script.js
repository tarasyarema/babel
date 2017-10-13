var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var img = document.getElementById("scream");
for(var y=0; y<3; y++){
     for(var x=0; x<5; x++){
          drawImage(img, 10+x*266, 10+y*266);
     }
}

function drawImage(img, x, y){
     ctx.drawImage(img, x, y, 2*128, 2*95);

     ctx.fillStyle = "white";
     ctx.fillRect(x, y+2*95, 2*128, 2*33);

     ctx.fillStyle = "black"
     ctx.font = "26px Arial";
     ctx.fillText("Hello, this is my", x+10, y+2*110);
     ctx.fillText("world...", x+10, y+2*124);
}
