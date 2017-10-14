$(function(){
	$(".menuImg").click(function(){
		$("div.menuTab").hide();
		$("div#"+$(this).attr("tab-id")).show();
	});
});
