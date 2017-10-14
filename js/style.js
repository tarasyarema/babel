$(function(){
	$(".menuImg").click(function(){
		var tabid = $(this).attr("tabid");
		var invisible = !$("#rightTab").is(":visible");
		if(tabid == "main" || invisible){
			if(invisible){
				$("#canvas").animate({width: 0.6*window.innerWidth}, 350);
				$("#leftTab").animate({width: 0.6*window.innerWidth}, 350);
			}else{
				$("#canvas").animate({width: window.innerWidth-70}, 350);
				$("#leftTab").animate({width: window.innerWidth-70}, 350);
			}
			$("#rightTab").animate({width:'toggle'},350);
		}else{
			$(".menuTab").hide();
			$("div#"+tabid).show();
		}
	});
});
