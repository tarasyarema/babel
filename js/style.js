var active_tab = null;
var tab_titles = {imageSearch: "Find your photo", comments: "Last comments", about: "About"};

function open_tab(tabid){
	stop_camera();
	$(".menuTab").hide();
	$("div#"+tabid).show();
	$("#tabTitle").text(tab_titles[tabid]);
	$(".menuImg").removeClass("active");
	$(".menuImg[tabid="+tabid+"]").addClass("active");
	$("body").addClass("panel-open");
	active_tab = tabid;
	resize_things();
}

function close_panel(){
	stop_camera();
	$(".menuImg").removeClass("active");
	$("body").removeClass("panel-open");
	active_tab = null;
	resize_things();
}

$(function(){
	$(".menuImg").click(function(){
		var tabid = $(this).attr("tabid");
		if(active_tab == tabid)
			close_panel();
		else
			open_tab(tabid);
	});
	$("#closeTab").click(close_panel);
	$(document).keydown(function(e){
		if(e.key == "Escape" && active_tab)
			close_panel();
	});
});
