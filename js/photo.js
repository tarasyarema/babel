// Photos stay in memory: nothing is uploaded, stored or kept after it is read.
var camera_stream = null;

// The camera is only requested here, when the user taps "Take photo".
function take_photo(){
	set_photo_status("");
	if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
		document.getElementById("capture_input").click();
		return;
	}
	navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(function(stream){
		stop_camera();
		camera_stream = stream;
		// The user may have left the Find tab while the permission prompt was open.
		if(active_tab != "imageSearch"){
			stop_camera();
			return;
		}
		document.getElementById("camera_video").srcObject = stream;
		$("#photo_actions").hide();
		$("#camera").show();
	}).catch(function(){
		set_photo_status("Couldn't open the camera. Allow camera access or use Upload image.");
	});
}

function stop_camera(){
	if(camera_stream){
		camera_stream.getTracks().forEach(function(track){ track.stop(); });
		camera_stream = null;
	}
	document.getElementById("camera_video").srcObject = null;
	$("#camera").hide();
	$("#photo_actions").show();
}

function capture_photo(){
	var video = document.getElementById("camera_video");
	if(!video.videoWidth)
		return;
	// The preview is mirrored like a selfie camera, so keep what the user saw.
	go_to_photo(get_image_data(video, true));
	stop_camera();
}

function get_file(input){
	var file = input.files[0];
	input.value = "";
	if(!file)
		return;
	var url = URL.createObjectURL(file);
	var img = new Image();
	img.onload = function(){
		URL.revokeObjectURL(url);
		go_to_photo(get_image_data(img));
	};
	img.onerror = function(){
		URL.revokeObjectURL(url);
		set_photo_status("That file isn't an image this browser can open.");
	};
	img.src = url;
}

function go_to_photo(image_data){
	var half_images = image_to_half_images(image_data);
	start_animation_towards(half_images[0], half_images[1]);
	// On phones the panel covers the library, so get out of the way.
	if(window.matchMedia("(max-width: 767px)").matches)
		close_panel();
}

function set_photo_status(text){
	document.getElementById("photo_status").textContent = text;
}
