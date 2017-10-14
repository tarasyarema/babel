var bar_invisible = true;
$(function(){
	Webcam.set({
		width: "320", 
		height: "240",
		flip_horiz: true,
		fps: 60
	});
	Webcam.attach('#my_camera');

	$("#rightTab").hide();
	$(".menuImg").click(function(){
		var tabid = $(this).attr("tabid");
		if(tabid == "main"){
			bar_invisible = !bar_invisible;
			console.log(bar_invisible);
			$("#rightTab").toggle();
			resize_things();
		}else{
			if(bar_invisible){
				$("#rightTab").show();
				bar_invisible = false;
				resize_things();
			}
			$(".menuTab").hide();
			$("div#"+tabid).show();
		}
	});
});
