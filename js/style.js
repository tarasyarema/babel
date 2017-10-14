var bar_invisible = true;
var active_tab = 0;
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
		var new_active_tab;
		if(tabid == "imageSearch")
			new_active_tab = 1;
		else if(tabid == "about")
			new_active_tab = 2;
		else
			new_active_tab = 3;
		if(bar_invisible){
			$("#rightTab").show();
			bar_invisible = false;
			resize_things();

			$(".menuTab").hide();
			$("div#"+tabid).show();
		}else if(active_tab == new_active_tab){
			$("#rightTab").hide();
			bar_invisible = true;
			resize_things();
		}else{
			$(".menuTab").hide();
			$("div#"+tabid).show();
		}
		active_tab = new_active_tab;
	});
});
